export const pickRandom = <T>(items: T[]) =>
	items[Math.floor(Math.random() * items.length)];

export async function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
