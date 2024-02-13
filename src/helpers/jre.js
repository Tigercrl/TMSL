import {invoke} from "@tauri-apps/api";

export const javaPaths = [];
export let java8Path;
export let java17Path;

export async function getJreVersion(path) {
    const regexVersion = /(?<=version ").+(?=")/;
    const regexVendor = /^.+(?= .+ Environment)/;
    const output = await invoke("java_version", {"path": path});
    if (output !== null) {
        const lines = output.split("\n");
        if (lines.length >= 2) {
            const version = lines[0].match(regexVersion)[0];
            const vendor = lines[1].match(regexVendor)[0];
            return [version, vendor];
        }
    }
    return null;
}

export async function setJava8Path(path) {
    java8Path = path;
}

export async function setJava17Path(path) {
    java17Path = path;
}

export async function getAllJavas() {
    const paths = await invoke("get_java_paths");
    for (let i = 0; i < paths.length; i++) {
        const output = await getJreVersion(paths[i])
        if (output !== null) {
            const [version, vendor] = output;
            if (version.includes("1.8") && java17Path === void (0)) {
                java8Path = paths[i];
            } else if (version.includes("17") && java17Path === void (0)) {
                java17Path = paths[i];
            }
            javaPaths.push({
                "path": paths[i], "version": version, "vendor": vendor
            });
        }
    }
}
