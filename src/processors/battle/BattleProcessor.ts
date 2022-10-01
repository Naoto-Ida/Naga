import {v1 as uuid} from 'uuid';

import Debuggable from '../../Debug';
import type {BattleProcessorEmitterEvents} from '../../emitter/BattleProcessorEmitter';
import BattleProcessorEmitter from '../../emitter/BattleProcessorEmitter';
import type IEntity from '../../entities/IEntity';
import type IDefensiveMove from '../../moves/defensive/IDefensiveMove';
import type IMove from '../../moves/IMove';
import type IOffensiveMove from '../../moves/offensive/IOffensiveMove';
import {pickRandom, wait} from '../../utils';
import renameCombatants from '../renameCombatants';
import {getPossibleTargetsBasedOnMove} from './getTargets';
import sortCombatants from './sortCombatants';
import type {BattleResult, BattleResultType, ProcessedTurn} from './types';

type ProcessedTurnBelligerent = {
	combatant: IEntity;
	targets: IEntity[];
};
export type BattleProcessorConf = {
	isDebug: boolean;
};
class BattleProcessor extends Debuggable {
	_isDebug = false;
	readonly event = new BattleProcessorEmitter<BattleProcessorEmitterEvents>();
	private readonly _instance?: BattleProcessor;
	private _initialCombatants: Record<string, IEntity> = {};
	private _pendingCombatants: IEntity[] = [];
	private _combatants: IEntity[] = [];
	private _isResolved = false;
	private _phase = 1;

	constructor() {
		super();

		if (this._instance) {
			throw new Error(
				"Singleton classes can't be instantiated more than once.",
			);
		}

		this._instance = this;
	}

	get phase() {
		return this._phase;
	}

	set phase(value: number) {
		this._phase = value;
	}

	async init(combatants: IEntity[], config?: BattleProcessorConf) {
		this.msg(
			`Combatants: ${combatants.map((combatant) => combatant.name).join(', ')}`,
			'info',
		);

		if (combatants.length === 0) {
			return {
				type: 'forfeit',
				combatants,
			};
		}

		if (config) {
			this._isDebug = config.isDebug;
		}

		const renamed = renameCombatants(combatants);

		for (const combatant of renamed) {
			const battleEntityId = uuid();
			combatant.battleEntityId = battleEntityId;
			const pos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

			combatant.currentPosition = [pickRandom(pos), pickRandom(pos)];

			// This._combatants[battleEntityId] = combatant;
			this._combatants.push(combatant);
		}

		this._combatants = sortCombatants(this._combatants);

		this._initialCombatants = this._combatants;

		this._pendingCombatants = this._combatants;

		this.event.subscribe('turnDecided', ({combatant, move, targets}) => {
			if (move) {
				const processedTurn = this.processMove(combatant, move, targets);

				if (processedTurn) {
					this.event.emit('turnEnd', {processedTurn});
				} else {
					this._isResolved = true;
				}
			} else {
				console.log(`❓  no decision by ${combatant.name}`);
				this.event.emit('turnEnd', {processedTurn: undefined});
			}
		});

		this.event.emit('start', undefined);
	}

	*handleTurn() {
		this.event.emit('phaseStart', this.phase);

		for (const c of this._pendingCombatants) {
			// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
			yield this.event.emit('turnStart', {combatant: c});
		}

		if (this.shouldResolveBattle()) {
			this._isResolved = true;
			this.event.emit('end', {
				resultType: this.getBattleResultType(),
				combatants: this._combatants,
			});
		} else {
			this.event.emit('phaseEnd', undefined);
		}
	}

	removeDead() {
		this._pendingCombatants = this._pendingCombatants.filter(
			(combatant) => !combatant.isDead,
		);
	}

	async handlePhase(): Promise<ProcessedTurn[]> {
		this._combatants = sortCombatants(this._combatants);
		this.msg(
			`🏎️  Turn order: ${this._combatants
				.map((entity) => `${entity.isDead ? '💀  ' : ''} ${entity.name}`)
				.join(', ')}`,
			'info',
		);

		return new Promise((resolve) => {
			const turns: ProcessedTurn[] = [];

			for (const combatant of this._combatants) {
				this.event.emit('turnStart', {combatant});

				const turn = this.takeTurn(combatant);
				if (turn) {
					this.event.emit('hit', {combatants: this._combatants});
					turns.push(turn);
				}

				if (!this.shouldResolveBattle()) {
					this._isResolved = true;
					this.event.emit('end', {
						resultType: this.getBattleResultType(),
						combatants: this._combatants,
					});
					break;
				}
			}

			resolve(turns);
		});
	}

	pickRandomMove(combatant: IEntity) {
		const selectedMove = pickRandom(combatant.availableMoves);
		const sig = combatant.isHero ? '➡️' : '⬅️';

		this.msg(`${sig}  ${combatant.name} chose the move "${selectedMove.name}"`);

		return selectedMove;
	}

	processMove(
		combatant: IEntity,
		move: IOffensiveMove | IDefensiveMove,
		targets: IEntity[],
	): ProcessedTurn | undefined {
		console.log(`Processing ${move.name} by ${combatant.name}`);

		if (this.shouldResolveBattle()) {
			this._isResolved = true;
			this.event.emit('end', {
				resultType: this.getBattleResultType(),
				combatants: this._combatants,
			});

			return;
		}

		for (const target of targets) {
			target.handleMove(move);
			console.log(
				`${target.name} was affected by ${combatant.name}'s ${move.name}`,
			);

			if (target.isDead) {
				this.event.emit('death', target);
				this.msg(`💀  ${target.name} is dead.`, 'debug');
			}

			for (const [index, c] of this._combatants.entries()) {
				if (c.battleEntityId === target.battleEntityId) {
					this._combatants[index] = target;
				}
			}
		}

		return {
			move,
			belligerent: {
				combatant,
				targets,
			},
		};
	}

	takeTurn(combatant: IEntity): ProcessedTurn | undefined {
		if (this.shouldResolveBattle()) {
			this._isResolved = true;
			return;
		}

		if (!combatant.canTakeTurn()) {
			console.warn(`Skipped turn for ${combatant.name}`);
			return;
		}

		const selectedMove = pickRandom(combatant.availableMoves);
		const sig = combatant.isHero ? '➡️' : '⬅️';

		this.msg(`${sig}  ${combatant.name} chose the move "${selectedMove.name}"`);

		const targets = getPossibleTargetsBasedOnMove(
			combatant,
			this._combatants,
			selectedMove,
		);

		for (const target of targets) {
			target.handleMove(selectedMove);

			if (target.isDead) {
				this.event.emit('death', target);
				this.msg(`💀  ${target.name} is dead.`, 'debug');
			}

			for (const [index, c] of this._combatants.entries()) {
				if (c.battleEntityId === target.battleEntityId) {
					this._combatants[index] = target;
				}
			}
		}

		return {
			move: selectedMove,
			belligerent: {
				combatant,
				targets,
			},
		};
	}

	get isResolved() {
		return this._isResolved;
	}

	get combatants() {
		return this._combatants;
	}

	shouldResolveBattle() {
		const heroesAlive = this._combatants.filter(
			(combatant) => combatant.isHero && !combatant.isDead,
		);
		const enemiesAlive = this._combatants.filter(
			(combatant) => !combatant.isHero && !combatant.isDead,
		);

		return heroesAlive.length === 0 || enemiesAlive.length === 0;
	}

	getBattleResultType(): BattleResultType {
		const enemiesAlive = this._combatants.filter(
			(combatant) => !combatant.isHero && !combatant.isDead,
		);

		if (enemiesAlive.length === 0) {
			return 'victory';
		}

		return 'defeat';
	}
}

export default BattleProcessor;
