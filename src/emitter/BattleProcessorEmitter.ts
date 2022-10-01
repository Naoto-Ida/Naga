import type IEntity from '../entities/IEntity';
import type IDefensiveMove from '../moves/defensive/IDefensiveMove';
import type IOffensiveMove from '../moves/offensive/IOffensiveMove';
import type {BattleResultType, ProcessedTurn} from '../processors/battle/types';

export type BattleProcessorEvent =
	| 'start'
	| 'phaseStart'
	| 'turnStart'
	| 'turnDecided'
	| 'turnEnd'
	| 'phaseEnd'
	| 'end'
	| 'death';

type Events = Record<string, Array<() => void>>;

export type BattleProcessorEmitterEvents = {
	start: undefined;
	phaseStart: number;
	turnStart: {combatant: IEntity};
	turnDecided: {
		combatant: IEntity;
		move?: IOffensiveMove | IDefensiveMove;
		targets: IEntity[];
	};
	turnEnd: {processedTurn?: ProcessedTurn};
	hit: {combatants: IEntity[]};
	death: IEntity;
	phaseEnd: undefined;
	end: {resultType: BattleResultType; combatants: IEntity[]};
};

class BattleProcessorEmitter<T> {
	public events: Events;
	private handlers: {
		[eventName in keyof T]?: Array<(value: T[eventName]) => void>;
	} = {};

	constructor(events?: Events) {
		this.events = events ?? {};
	}

	subscribe<K extends keyof T>(event: K, handler: (value: T[K]) => void): void {
		if (this.handlers[event]) {
			this.handlers[event].push(handler);
		} else {
			this.handlers[event] = [handler];
		}
	}

	emit<K extends keyof T>(event: K, value: T[K]): void {
		if (this.handlers[event]) {
			for (const h of this.handlers[event]) {
				h(value);
			}
		}
	}
}

export default BattleProcessorEmitter;
