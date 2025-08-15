export function GM_fetch(
	details: VMScriptGMXHRDetails<string | object | Document | Blob | ArrayBuffer>,
): Promise<VMScriptResponseObject<string | object | Document | Blob | ArrayBuffer>> {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			...details,
			onload: (response) => resolve(response),
			onerror: (err) => reject(err),
			timeout: 10000,
		});
	});
}
