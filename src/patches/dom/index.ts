import { Patch } from '..';

export const domEvents = (): Patch[] => {
	return [
		{
			name: 'domRightSidebar',
			find: 'shop-profile-picture',
			replace: {
				match:
					/[a-zA-Z_$][\w$]*=[a-zA-Z_$][\w$]*=>{var ([a-zA-Z_$][\w$]*)=[a-zA-Z_$][\w$]*\(\)[^}]*?;(?=[^}]*?shop-profile-picture)/,
				replace: (orig, elem) =>
					`${orig};document.dispatchEvent(new CustomEvent('wpf-right-sidebar',{detail:${elem}}));`,
			},
		},
	];
};
