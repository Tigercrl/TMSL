import { BaseDirectory, createDir, exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

// Default config
var defaultConfig = JSON.stringify({
	"firstLoad": true,
	"theme": "light"
}, null, 4)

// Save default config if config does not exists
async function saveDefaultConfig() {
	if (!await exists('config.json', { dir: BaseDirectory.AppData })){
		// Make sure data folder exists
		await createDir('', { dir: BaseDirectory.AppData, recursive: true });
		// Create config
		await writeTextFile('config.json', defaultConfig, { dir: BaseDirectory.AppData });
	}
}

// Read config
var config;
async function loadConfig() {
	config = JSON.parse(await readTextFile('config.json', { dir: BaseDirectory.AppData }));
}

// Save config
async function saveConfig() {
	await writeTextFile('config.json', config, { dir: BaseDirectory.AppData });
}

export {
	config,
	loadConfig,
	saveDefaultConfig
}