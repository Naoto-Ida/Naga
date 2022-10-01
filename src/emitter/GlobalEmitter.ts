type Events = Record<string, Array<() => void>>;

export type GlobalEmitterEvents = {
	pause: undefined;
	resume: undefined;
};

class GlobalEmitter<T> {
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

export default GlobalEmitter;
