import type IEntity from '../entities/IEntity';

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

export type SceneEmitterEvents = {
	start: string;
	requestOverworld: undefined;
	requestSimulator: undefined;
	requestBattle: IEntity[] | undefined;
};

class SceneEmitter<T> {
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

export default SceneEmitter;
