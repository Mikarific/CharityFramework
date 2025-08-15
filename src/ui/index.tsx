import { render } from 'solid-js/web';

export function init() {
	function Settings() {
		return (
			<div>
				<h1>SETTINGS</h1>
			</div>
		);
	}
	render(Settings, document.documentElement);
}
