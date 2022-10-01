import type IEntity from '../entities/IEntity';

const alphabet = [...Array.from({length: 26})].map((_, i) =>
	String.fromCodePoint(i + 97).toUpperCase(),
);

function renameCombatants(combatants: IEntity[]) {
	const stack: string[] = [];

	const name_changer = (n: string) => {
		const splitted = n.split('_');
		console.warn({splitted});

		if (splitted.length > 1) {
			const name = splitted[0];
			const ord = Number.parseInt(splitted[1]);
			return `${name}_${ord + 1}`;
		}

		return `${n}_${1}`;
	};

	for (const combatant of combatants) {
		if (stack.includes(combatant.name)) {
			combatant.name = name_changer(combatant.name);
		}

		stack.push(combatant.name);
	}

	return combatants;
}

export default renameCombatants;
