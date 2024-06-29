export function setAsyncTimeout(handler: () => any, timeout = 0) {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			handler();
			resolve();
		}, timeout);
	});
}
