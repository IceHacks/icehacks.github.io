window.isLight = color => {
	const hex = color.replace("#", "");
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
	return brightness > 155;
};

Vue.component("ice-header", {
	props: ["name"],
	template: `
		<div class="header">
			<div class="inner">
				<span>{{name}}</span>
			</div>
		</div>
	`
});
Vue.component("ice-content", {
	template: `
		<div class="content">
			<div class="inner">
				<slot></slot>
			</div>
		</div>
	`
});
Vue.component("ice-section", {
	props: ["width", "size"],
	template: `
		<div class="section" :style="(width ? 'max-width:'+ width + 'px;' : '') + (size ? 'flex:'+size+';' : '')">
			<slot></slot>
		</div>
	`
});
Vue.component("ice-box", {
	props: ["color", "title"],
	template: `
		<div class="box" :style="(color ? 'background:'+color+';' : '') + (color ? isLight(color) ? 'color:black;' : 'color:white;' : '')">
			<h1 v-if=title>{{title}}</h1>
			<slot></slot>
		</div>
	`,
	methods: {
		isLight: window.isLight
	}
});
Vue.component("ice-footer", {
	props: ["name"],
	template: `
		<ice-box color="#1b1b1b">
			&copy; {{new Date().getFullYear()}} {{name}}
		</ice-box>
	`
});
Vue.component("ice-install", {
	template: `
		<ice-box color="#6C464F">
			<div class="install-box">
				<div class="install-section">
					<h1 style="margin:unset;">v1.1.6</h1>
					<spacer></spacer>
					<button>INSTALL</button>
				</div>
				<div class="install-section">
					hi
				</div>
			</div>
		</ice-box>
	`
});
Vue.component("spacer", {
	template: `
		<div class="spacer"></div>
	`
});

var app = new Vue({
	el: "#app",
	data: {
		name: "IceHacks"
	}
});
