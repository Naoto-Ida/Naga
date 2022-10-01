import {
	DEFAULT_CATEGORY,
	DEFAULT_ELEMENT,
	DEFAULT_TARGET_GROUP,
	DEFAULT_TYPE,
} from './defaultValues';
import type {
	MoveCategory,
	MoveElement,
	MoveTarget,
	MoveTargetGroup,
	MoveType,
} from './types';

export type MoveConstructor = {
	name: string;
	description: string;
	category?: MoveCategory;
	element?: MoveElement;
	type?: MoveType;
	target: MoveTarget;
	targetGroup?: MoveTargetGroup;
	soundEffectPath?: string;
	accuracy?: number;
};

abstract class IMove {
	private _name: string;
	private _description: string;
	private _category: MoveCategory;
	private readonly _element: MoveElement;
	private readonly _type: MoveType;
	private _target: MoveTarget;
	private _targetGroup: MoveTargetGroup;
	private readonly _soundEffectPath: string;
	private _accuracy: number;

	constructor({
		name,
		description,
		category = DEFAULT_CATEGORY,
		element = DEFAULT_ELEMENT,
		type = DEFAULT_TYPE,
		target,
		targetGroup = DEFAULT_TARGET_GROUP,
		soundEffectPath = 'sounds/owa.mp3',
		accuracy = 100,
	}: MoveConstructor) {
		this._name = name;
		this._description = description;
		this._category = category;
		this._element = element;
		this._type = type;
		this._target = target;
		this._targetGroup = targetGroup;
		this._soundEffectPath = soundEffectPath;
		this._accuracy = accuracy;
	}

	/**
	 * The name of the move displayed in the UI.
	 */
	get name() {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	/**
	 * The description of the move displayed in the UI.
	 */
	get description() {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}

	get category() {
		return this._category;
	}

	set category(value: MoveCategory) {
		this._category = value;
	}

	get element() {
		return this._element;
	}

	/**
	 * The type of the move.
	 */
	get type() {
		return this._type;
	}

	get target() {
		return this._target;
	}

	set target(value: MoveTarget) {
		this._target = value;
	}

	get targetGroup() {
		return this._targetGroup;
	}

	set targetGroup(value: MoveTargetGroup) {
		this._targetGroup = value;
	}

	get soundEffectPath() {
		return this._soundEffectPath;
	}

	/**
	 * A number from 0 to 100, which influences the likeliness of the move working.
	 */
	get accuracy() {
		return this._accuracy;
	}

	set accuracy(value: number) {
		this._accuracy = value;
	}
}

export default IMove;
