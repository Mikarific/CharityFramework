import { Patch } from '..';

export const trswPatches = (): Patch[] => [
	{
		name: 'trswStubSend',
		find: `"You're an using an older browser, some features might not work. Consider updating or changing browser."`,
		replace: {
			match: /return new Promise\(\((.),.\)=>{.*?}catch\(.\){.\(.\)}}\)/,
			replace: () => 'return Promise.resolve(null)',
		},
	},
];
