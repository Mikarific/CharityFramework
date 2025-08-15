// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defineGlobalPath = (parent: any, name: string) =>
	!parent[name] ?
		Object.defineProperty(parent, name, { configurable: false, enumerable: true, writable: false, value: {} })
	:	false;
