import { createApp } from "vue";
import App from "./App.vue";
import Greet from "./pages/Greet.vue";
import { config, loadConfig, saveDefaultConfig } from "./helpers/config.ts";
import { setupWizard } from "./helpers/setup.ts";
import { appWindow } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/api/process'

var isMacOS = navigator.userAgent.includes("Mac");
var app;

main();

async function main(){
	// Load config
	await saveDefaultConfig();
	await loadConfig();

	//i18n
	var lang = config.lang
    if (lang == "auto")
        lang = navigator.language;
    var str = await (await fetch("/i18n/"+ lang +".json")).text();
	if (str == undefined)
		str = await (await fetch("/i18n/en-US.json")).text();
    var script = document.createElement("script");
    script.innerHTML = "i18n.translator.add(" + str + ");";
    document.body.appendChild(script);

	// Show close and minimize button if is not macos
	if (!isMacOS){
		var navButtons = document.getElementsByClassName("nav-button");
		navButtons[0].style.display = "unset";
		navButtons[1].style.display = "unset";
	}

	// Dark theme
	if ((config.theme == "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) || config.theme == "dark"){
		if (isMacOS)
			document.body.classList.add('theme-dark');
		(document.getElementById("app") as Element).classList.add('theme-dark');
	}


	// Splash
	app = createApp(App);
	app.mount('#app');

	await sleep(3000);

	// Show nav

	// Setup wizard
	if (config.firstLoad){
		// Greeting page
		app.unmount();
		app = createApp(Greet);
		app.mount('#app');
		await setupWizard();
	}
}

// Some functions
async function sleep(ms){
	await new Promise((resolve) => setTimeout(resolve, ms));
}

// Close and minimize button
document.getElementsByClassName("nav-button")[0].addEventListener('click',async function(){
	await exit();
},false);
document.getElementsByClassName("nav-button")[1].addEventListener('click',async function(){
	await appWindow.minimize();
},false);

export {
	app
}