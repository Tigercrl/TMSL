import {createApp} from "vue";
import {createI18n} from 'vue-i18n'
import {config, loadConfig, saveConfig, saveDefaultConfig} from "./helpers/config.js";
import router from "./router";
import App from "./App.vue";
import "./assets/css/styles.css";
import "./assets/css/themes.css";
import {os} from "@tauri-apps/api";
import axios from "axios";

export let i18n;
export let version;
export let isMacOS;

main();

async function main() {
    // macOS detect
    isMacOS = await os.type() === "Darwin";

    // Get version
    version = "1.0.0";

    // Load config
    await saveDefaultConfig();
    await loadConfig();

    // i18n
    let lang = config.lang;
    if (lang === "auto") lang = navigator.language;
    let messages = {
        "en-US": (await axios.get("/assets/i18n/en-US.json")).data
    };
    messages[lang] = (await axios.get("/assets/i18n/" + lang + ".json")).data
    i18n = createI18n({
        fallbackLocale: "en-US", locale: lang, messages: messages
    })

    // Load theme
    if ((config.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) || config.theme === "dark") {
        if (isMacOS) document.getElementsByTagName("html")[0].classList.add('theme-dark');
        document.getElementById("app").classList.add('theme-dark');
    }

    // App
    const app = createApp(App);
    app.use(i18n);
    app.use(router)
    app.mount("#app");
}