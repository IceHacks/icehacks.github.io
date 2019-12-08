window.isLight = color => {
	const hex = color.replace("#", "");
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
	return brightness > 155;
};
var get = theUrl => {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	xmlHttp.send(null);
	return xmlHttp.responseText;
};
var versions = JSON.parse(
	get("https://api.github.com/repos/IceHacks/SurvivCheatInjector/releases")
);
var latest = versions[0]["tag_name"];
var blog = location.pathname.match(/blog/g);
var blogdata;

if (blog) {
	blogData = JSON.parse(get("/blog/index.json"));
}

Vue.component("ice-header", {
	props: ["name", "sub"],
	template: `
		<div class="header">
			<div class="inner">
				<span>{{name}}</span>
				<span class="sub" v-if="sub">&nbsp{{sub}}</span>
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
	props: ["color", "title", "url", "no"],
	template: `
		<div class="box" :style="(color ? 'background:'+color+';' : '') + (color ? isLight(color) ? 'color:black;' : 'color:white;' : '')">
			<h1 :style="(no ? 'margin:0;' : '')" v-if=title><span>{{title}}</span><a v-if=url v-bind:href=url target="_blank"><i class="material-icons">open_in_new</i></a></h1>
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
		<ice-box color="#7c7d89" style="background: url(/images/background.png);background-attachment: fixed;background-size: cover;max-height: 200px;overflow-y: hidden;box-shadow: inset 0 -55px 20px -30px #f1f1f1;border-radius: 6px 6px 0 0;">
			<div class="install-box">
				<div class="install-section">
					<h1 style="margin:unset;">${latest}</h1>
					<spacer></spacer>
					<button onclick="javascript:window.open('${
						versions[0]["html_url"]
					}', '_blank')">INSTALL</button>
				</div>
				<div class="install-section" style="display: block;">
					${versions[0].body
						.replace(/\r\n/g, "<br>")
						.replace(/[#]+(.+?)<br>/g, "<b>$1</b><br>")}
				</div>
			</div>
		</ice-box>
	`
});
Vue.component("ice-social", {
	props: ["color", "title", "button", "url", "button-color"],
	template: `
		<ice-box class="social" :color=color>
			<div class="install-box">
				<div class="install-section" :style="(color ? isLight(color) ? 'color:black;' : 'color:white;' : '')">
					<h1 style="margin:unset;">{{title}}</h1>
					<spacer></spacer>
					<button :style="(buttonColor ? 'background-color:'+buttonColor+';' : '') + (buttonColor ? isLight(buttonColor) ? 'color:black;' : 'color:white;' : '')"  @click="function(){window.open(url, '_blank')}">{{button}}</button>
				</div>
			</div>
		</ice-box>
	`,
	methods: {
		isLight: window.isLight
	}
});
Vue.component("spacer", {
	template: `
		<div class="spacer"></div>
	`
});
Vue.component("ice-version", {
	template: `<span>v${latest}</span>`
});
Vue.component("ice-downloads", {
	template: `<span>${versions[0].assets[0]["download_count"]}</span>`
});
Vue.component("ice-sidebar", {
	template: `
		<ice-section size="0.8" width="450">
			<ice-install></ice-install>
			<ice-social color="#da3939" title="YouTube" button="SUBSCRIBE" button-color="#f1f1f1" url="https://youtube.com/c/IceHacks?sub_confirmation=1"></ice-social>
			<ice-social color="#36393f" title="Discord" button="JOIN" button-color="#738bd7" url="https://discord.gg/dk6b5aj"></ice-social>
		</ice-section>
	`
});
Vue.component("ice-blog", {
	template: `
		<div>
			<ice-box v-if="blog.length < 1">
				Nothing here...
			</ice-box>
			<ice-box v-for="(b, id) in blog" :title=b.title>
				{{b.content}}

				<small class="date">{{new Date(b.date).toLocaleString()}}</small>
			</ice-box>
		</div>
	`,
	data: () => {
		return {
			blog: blogData || null
		};
	}
});

var app = new Vue({
	el: "#app",
	data: {
		name: "IceHacks"
	}
});

$("#app").show();
