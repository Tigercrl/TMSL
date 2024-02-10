import {BaseDirectory, createDir, exists, readTextFile, writeTextFile} from '@tauri-apps/api/fs';
import {version} from "../main.js";
import {getAllJavas, getJreVersion, java17Path, java8Path, setJava17Path, setJava8Path} from "./jre.js";

// Default config
const defaultConfig = {
    "agreedUserGuidelines": false, "lang": "auto", "theme": "auto", "java": {
        "java8": "auto", "java17": "auto"
    }
}

export let config = {};

// Save default config if config does not exists
export async function saveDefaultConfig() {
    defaultConfig["version"] = version;
    if (!await exists('config.json', {dir: BaseDirectory.AppData})) {
        // Make sure data folder exists
        await createDir('', {dir: BaseDirectory.AppData, recursive: true});
        // Create config
        await writeTextFile('config.json', JSON.stringify(defaultConfig), {dir: BaseDirectory.AppData});
    }
}

// Read config
export async function loadConfig() {
    defaultConfig.version = version;
    config = JSON.parse(await readTextFile('config.json', {dir: BaseDirectory.AppData}));
    // Missing values
    for (let key in defaultConfig) {
        if (config[key] === undefined) {
            config[key] = defaultConfig[key];
        }
    }
    // Java Paths
    if (config["java"]["java8"] !== "auto") {
        if ((await getJreVersion(config["java"]["java8"])) !== null) {
            config.java.java8 = "auto";
        } else {
            await setJava8Path(config.java.java8);
        }
    }
    if (config["java"]["java17"] !== "auto") {
        if ((await getJreVersion(config["java"]["java17"])) !== null) {
            config.java.java17 = "auto";
        } else {
            await setJava17Path(config.java.java17);
        }
    }
    await getAllJavas();
    await saveConfig();
}

// Save config
export async function saveConfig() {
    await saveDefaultConfig();
    await writeTextFile('config.json', JSON.stringify(config), {dir: BaseDirectory.AppData});
}