import type IDefensiveMove from '../moves/defensive/IDefensiveMove';
import type IOffensiveMove from '../moves/offensive/IOffensiveMove';
import {MULTIPLIER} from '../processors/multipliers';
import {pickRandom} from '../utils';
import {
	DEFAULT_GUARDED_DURATION,
	DEFAULT_JUICE_DURATION,
	DEFAULT_NON_TARGETABLE_DURATION,
	DEFAULT_OIL_DURATION,
	DEFAULT_PARALYSIS_DURATION,
	DEFAULT_POISON_DURATION,
} from './constants';
import {
	DEFAULT_SPEED,
	DEFAULT_AVAILABLE_MOVES,
	DEFAULT_IS_DEAD,
} from './defaultValues';
import type {EntityArchetype, EntityStatus, EntityStatus2} from './types';

export type EntityConstructor = {
	name: string;
	level?: number;
	statuses?: Partial<Record<EntityStatus, EntityStatus2 | undefined>>;
	archetype?: EntityArchetype;
	currentHealth?: number;
	maxHealth: number;
	currentSpeed?: number;
	maxSpeed?: number;
	availableMoves?: Array<IOffensiveMove | IDefensiveMove>;
	isDead?: boolean;
	currentMoves?: number;
	maxMoves?: number;
	avatar?: string;
	currentPosition?: [x: number, y: number];
};

abstract class IEntity {
	abstract isHero: boolean;
	private readonly _level: number;
	private _battleEntityId: string;
	private _statuses: Partial<Record<EntityStatus, EntityStatus2 | undefined>>;
	private _name: string;
	private _archetype: EntityArchetype;
	private _currentHealth: number;
	private _maxHealth: number;
	private _currentSpeed: number;
	private _maxSpeed: number;
	private _availableMoves: Array<IOffensiveMove | IDefensiveMove>;
	private _isDead: boolean;
	private readonly _currentMoves: number;
	private readonly _maxMoves: number;
	private readonly _avatar: string;
	private _currentPosition: [x: number, y: number];

	constructor({
		name,
		level = 1,
		currentHealth,
		maxHealth,
		archetype = 'pure',
		currentSpeed,
		maxSpeed = DEFAULT_SPEED,
		statuses = {},
		availableMoves = DEFAULT_AVAILABLE_MOVES,
		isDead = DEFAULT_IS_DEAD,
		currentMoves = 0,
		maxMoves = 0,
		avatar = '/avatars/seed1564.png',
		currentPosition = [0, 0],
	}: EntityConstructor) {
		this._name = name;
		this._level = level;
		this._archetype = archetype;
		this._currentHealth = currentHealth ?? maxHealth;
		this._maxHealth = maxHealth;
		this._currentSpeed = currentSpeed ?? maxSpeed;
		this._maxSpeed = maxSpeed;
		this._availableMoves = availableMoves;
		this._isDead = isDead;
		this._statuses = statuses;
		this._currentMoves = currentMoves;
		this._maxMoves = maxMoves;
		this._avatar = avatar;
		this._currentPosition = currentPosition;
	}

	get level() {
		return this._level;
	}

	get battleEntityId() {
		return this._battleEntityId;
	}

	set battleEntityId(value: string) {
		this._battleEntityId = value;
	}

	get name() {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get archetype() {
		return this._archetype;
	}

	set archetype(value: EntityArchetype) {
		this._archetype = value;
	}

	get currentHealth() {
		return this._currentHealth;
	}

	set currentHealth(value: number) {
		this._currentHealth = value;
	}

	get maxHealth() {
		return this._maxHealth;
	}

	set maxHealth(value: number) {
		this._maxHealth = value;
	}

	get currentSpeed() {
		return this._currentSpeed;
	}

	set currentSpeed(value: number) {
		this._currentSpeed = value;
	}

	get maxSpeed() {
		return this._maxSpeed;
	}

	set maxSpeed(value: number) {
		this._maxSpeed = value;
	}

	get availableMoves() {
		return this._availableMoves;
	}

	set availableMoves(value: Array<IOffensiveMove | IDefensiveMove>) {
		this._availableMoves = value;
	}

	addStatus(value: EntityStatus) {
		console.log(`${value}-ing ${this.name}`);
		switch (value) {
			case 'guarded':
				this.addGuardedStatus();
				break;
			case 'nonTargetable':
				this.addNonTargetableStatus();
				break;
			case 'oiled':
				this.addOilStatus();
				break;
			case 'paralyzed':
				this.addParalysisStatus();
				break;
			case 'poisoned':
				this.addPoisonStatus();
				break;
			default:
				break;
		}
	}

	get isDead() {
		return this._isDead;
	}

	set isDead(value: boolean) {
		this._isDead = value;
	}

	get currentMoves() {
		return this._currentMoves;
	}

	get maxMoves() {
		return this._maxMoves;
	}

	get avatar() {
		return this._avatar;
	}

	get currentPosition() {
		return this._currentPosition;
	}

	set currentPosition(value: [x: number, y: number]) {
		this._currentPosition = value;
	}

	handleMove(move: IOffensiveMove | IDefensiveMove): void {
		if ('rawDamageValue' in move) {
			this.receiveAttackMove(move);
		}

		if (move.statusEffects.length > 0) {
			for (const statusEffect of move.statusEffects) {
				this.addStatus(statusEffect);
			}

			if (move.statusEffects.includes('juiced')) {
				this.currentSpeed *= MULTIPLIER.JUICED_SPEED;
			}
		}
	}

	canTakeTurn() {
		if (this.isParalyzed) {
			const odds = [1, 2, 3];

			if (pickRandom(odds) === 2) {
				console.log(`${this.name} is paralyzed and cannot move this turn.`);
				return false;
			}

			return true;
		}

		return true;
	}

	incrementStatus() {
		const animations = [];

		for (const [statusName, statusEntry] of Object.entries(this._statuses)) {
			this._statuses[statusName]!.current += 1;

			if (
				this._statuses[statusName]!.current ===
				this._statuses[statusName]!.duration
			) {
				this.removeStatus(statusName);
			}
		}
	}

	addGuardedStatus() {
		if (this._statuses.guarded) {
			console.log(`${this.name} is already guarded.`);
		}

		this._statuses.guarded = {
			type: 'guarded',
			description: 'Test',
			duration: DEFAULT_GUARDED_DURATION,
			current: 0,
		};
	}

	addJuicedStatus() {
		if (this._statuses.juiced) {
			console.log(`${this.name} is already juiced.`);
		}

		this._statuses.juiced = {
			type: 'juiced',
			description: 'Test',
			duration: DEFAULT_JUICE_DURATION,
			current: 0,
		};
	}

	addNonTargetableStatus() {
		if (this._statuses.nonTargetable) {
			console.log(`${this.name} is already nonTargetable.`);
		}

		this._statuses.nonTargetable = {
			type: 'nonTargetable',
			description: `Cannot be targetted for ${DEFAULT_NON_TARGETABLE_DURATION} turn`,
			duration: DEFAULT_NON_TARGETABLE_DURATION,
			current: 0,
		};
	}

	addOilStatus() {
		if (this._statuses.poisoned) {
			console.log(`${this.name} is already poisoned.`);
		}

		this._statuses.poisoned = {
			type: 'oiled',
			description: 'Test',
			duration: DEFAULT_OIL_DURATION,
			current: 0,
		};
	}

	addParalysisStatus() {
		if (this._statuses.paralyzed) {
			console.log(`${this.name} is already paralyzed.`);
		}

		this._statuses.paralyzed = {
			type: 'paralyzed',
			description: 'Test',
			duration: DEFAULT_PARALYSIS_DURATION,
			current: 0,
		};
	}

	addPoisonStatus() {
		if (this._statuses.poisoned) {
			console.log(`${this.name} is already poisoned.`);
		}

		this._statuses.poisoned = {
			type: 'poisoned',
			description: 'Test',
			duration: DEFAULT_POISON_DURATION,
			current: 0,
		};
	}

	removeStatus(value: EntityStatus) {
		delete this._statuses[value];

		console.warn(`Removed status ${value}`);
	}

	get isGuarded() {
		return Boolean(this._statuses.guarded);
	}

	get isJuiced() {
		return Boolean(this._statuses.juiced);
	}

	get isNonTargetable() {
		return Boolean(this._statuses.nonTargetable);
	}

	get isOiled() {
		return Boolean(this._statuses.oiled);
	}

	get isParalyzed() {
		return Boolean(this._statuses.paralyzed);
	}

	get isPoisoned() {
		return Boolean(this._statuses.poisoned);
	}

	get statuses() {
		return this._statuses;
	}

	reset() {
		this.battleEntityId = undefined;
		this.isDead = false;
	}

	private receiveAttackMove(move: IOffensiveMove) {
		let damage = move.rawDamageValue;

		if (this.isGuarded) {
			damage *= MULTIPLIER.GUARDED_DEFENSE;

			console.log(
				`${this.name} is taking reduced damage of ${damage} by ${move.name}`,
			);
		}

		if (move.element === 'fire' && this.isOiled) {
			damage *= MULTIPLIER.OILED_VULNERABILITY;

			console.log(
				`${this.name} is taking increased damage of ${damage} by ${move.name} due to being oiled`,
			);
		}

		if (this.currentHealth - damage < 0) {
			this.currentHealth = 0;
		} else {
			this.currentHealth -= damage;
		}

		if (this.currentHealth <= 0) {
			this.isDead = true;
		}
	}
}

export default IEntity;
