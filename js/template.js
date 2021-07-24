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
var markdown = new showdown.Converter();
var markdownToHTML = str => {
	return (
		"<div class='markdown-body'>" +
		markdown.makeHtml(str.trim().replace(/(?!\r|\n)(\s\s|\t)/g, "")) +
		"</div>"
	);
};
var linkToHTML = str => {
	// http://, https://, ftp://
	var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

	// www. sans http:// or https://
	var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

	// Email addresses
	var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

	return str
		.replace(urlPattern, '<a href="$&">$&</a>')
		.replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
		.replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};
var latest = versions[0]["tag_name"];

var isBlog = location.pathname.match(/blog/g);

var data;

if (isBlog) {
	data = JSON.parse(get("/blog/index.json"));
}
Vue.config.devtools = true;

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
Vue.component("ice-staff", {
	template: `
		<div class="staff-card">
		
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
Vue.component("markdown", {
	template: `
		<div v-html="linkToHTML(markdown(this.$slots.default[0].text))">
		
	{{console.log(this.$slots.default[0])}}
		</div>
	`,
	data: () => {
		return {
			markdown: markdownToHTML,
			linkToHTML
		};
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
					${markdown.makeHtml(versions[0].body)}
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
	template: `<span>${versions[0].assets[0][
		"download_count"
	].toLocaleString()}</span>`
});
Vue.component("ice-sidebar", {
	template: `
		<ice-section size="0.8" width="450">
			<ice-install></ice-install>
			<ice-social color="#da3939" title="YouTube" button="SUBSCRIBE" button-color="#f1f1f1" url="https://youtube.com/c/IceHacks?sub_confirmation=1"></ice-social>
			<ice-social color="#36393f" title="Discord" button="JOIN" button-color="#738bd7" url="https://discord.gg/FB6vjtE4xv"></ice-social>
			<ice-social color="#0088cc" title="Telegram" button="JOIN" button-color="#FFFFFF" url="https://t.me/icehacks"></ice-social
		</ice-section>
	`
});
Vue.component("ice-posts", {
	template: `
		<div>
			<ice-box v-if="!data || !data.length || (data.length && data.length < 1)">
				Nothing here...
			</ice-box>
			<ice-box v-for="(b, id) in data" :title=b.title>
				<div v-html="(markdown(b.content))"></div>

				<small class="date">{{new Date(b.date).toLocaleString()}}</small>
			</ice-box>
		</div>
	`,
	data: () => {
		return {
			data: data
				.sort((a, b) => {
					return b.date - a.date;
				})
				.filter(a => Date.now() > a.date),
			markdown: markdownToHTML,
			linkToHTML
		};
	}
});
Vue.component("ice-navbar", {
	props: ["main", "blog", "cheats", "staff"],
	template: `
		<div>
			<ul class="navbar">
				<div class="inner">
					<li class="navbar-li"><a v-bind:class="(typeof main == 'string' ?  'navbar-active' : '') + ' navbar-list'" href="/">Home</a></li>
					<li class="navbar-li"><a v-bind:class="(typeof blog == 'string' ?  'navbar-active' : '') + ' navbar-list'" href="/blog/">Blog</a></li>
					<li class="navbar-li"><a v-bind:class="(typeof cheats == 'string' ?  'navbar-active' : '') + ' navbar-list'" href="/cheats/">Cheats</a></li>
					<li class="navbar-li"><a v-bind:class="(typeof staff == 'string' ?  'navbar-active' : '') + ' navbar-list'" href="/staff/">Staff</a></li>
				</div>
			</ul>
		</div>
	`
});
Vue.component("ice-staff", {
	props: ["name", "img", "desc"],
	template: `
	<div style="position: relative; text-align: center; width: 250px; height: 315px; background: #e6e5e3; border-radius: 4px; padding: 12px 15px; margin: 20px; box-shadow: 0 0 15px rgb(0 0 0 / 82%), 0 1px 4px rgb(0 0 0 / 10%); display: box;">
		<img style="min-width: 110px; max-width: 110px; min-height: 110px; max-height: 110px; border-radius: 50%; overflow: hidden; align: center;" src="(img)">
		<div style="margin: 10px 0; font-size: 18px; color: #30302e;"><div v-html="(name)"></div></div>
		<div style="max-height: 100px; overflow: hidden; white-space: pre-wrap; margin-bottom: 10px;"><div v-html="(desc)"></div></div>
	</div>`
});

var app = new Vue({
	el: "#app",
	data: {
		name: "IceHacks"
	}
});

$("#app").show();
