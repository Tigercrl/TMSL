import { createApp } from "vue";
import "./css/style.css";
import "./css/theme-dark.css";
import App from "./App.vue";
import Greet from "./pages/Greet.vue";
import { config, loadConfig, saveDefaultConfig } from "./helpers/config.ts";
import { setupWizard } from "./helpers/setup.ts";

var app;

main();

async function main(){
	app = createApp(App);
	app.mount('#app');
	await saveDefaultConfig();
	await loadConfig();
	// Theme
	if ((config.theme == "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) || config.theme == "dark")
		document.body.classList.add('theme-dark')
	// Wait for animation to finish and then fade out
	setTimeout(() => {
		document.body.getElementsByClassName("logo-container")[0].style.animation = ".5s ease-in-out .5s reverse both fadeIn";
	}, 2000);
	// Setup Wizard
	if (config.firstLoad){
		// Greeting page
		setTimeout(() => {
			app.unmount();
			app = createApp(Greet);
			app.mount();
		}, 3000);
		await setupWizard();
	}
}