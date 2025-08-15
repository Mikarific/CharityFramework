export async function GM_fetch(
	details: VMScriptGMXHRDetails<string | object | Document | Blob | ArrayBuffer>,
): Promise<VMScriptResponseObject<string | object | Document | Blob | ArrayBuffer>> {
	try {
		return await new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				...details,
				onload: (response) => resolve(response),
				onerror: (err) => reject(err),
				timeout: 10000,
			});
		});
	} catch {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			if (details.responseType) req.responseType = details.responseType;
			req.addEventListener('load', (e) => {
				resolve({
					context: details.context,
					finalUrl: req.responseURL,
					lengthComputable: e.lengthComputable,
					loaded: e.loaded,
					readyState: req.readyState,
					response: req.response,
					responseHeaders: req.getAllResponseHeaders(),
					responseText: req.responseText,
					responseXML: req.responseXML,
					status: req.status,
					statusText: req.statusText,
					total: e.total,
				});
			});
			req.addEventListener('error', (err) => reject(err));
			req.open(details.method || 'GET', details.url, true, details.user, details.password);
			if (details.headers) {
				for (const [header, value] of Object.entries(details.headers)) {
					req.setRequestHeader(header, value);
				}
			}
			req.send();
		});
	}
}
