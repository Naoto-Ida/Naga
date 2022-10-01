class Keyboard {
	attachEvents() {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'r') {
				window.location.reload();
			}
		});
	}
}

export default Keyboard;
