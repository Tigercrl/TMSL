// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::canonicalize;
use std::env;
use std::path::PathBuf;
use std::process::Command;
use std::collections::HashSet;

/* 获取java -version命令的输出 */
#[tauri::command]
fn java_version(path: String) -> Option<String> {
    let output = Command::new(path).arg("-version").output().ok()?;
    let stdout = String::from_utf8_lossy(&output.stderr);
    return Some(stdout.to_string());
}

/* 获取系统上所有的java */
// Windows
#[cfg(target_os = "windows")]
#[tauri::command]
fn get_java_paths() -> Option<HashSet<PathBuf>> {
    let mut java_paths = HashSet::new();

    // 检测环境变量
    java_paths.extend(get_java_in_path());
    if let Ok(java_home) = env::var("JAVA_HOME") {
        java_paths.insert(PathBuf::from(java_home));
    }

    // Java默认安装位置
    let java_installation_paths = [
        r"C:/Program Files/Java",
        r"C:/Program Files (x86)/Java",
        r"C:\Program Files\Eclipse Adoptium",
        r"C:\Program Files (x86)\Eclipse Adoptium",
    ];
    for java_path in java_installation_paths {
        let Ok(java_sub_paths) = std::fs::read_dir(java_path) else {
            continue;
        };
        for java_sub_path in java_sub_paths.flatten() {
            let path = java_sub_path.path();
            java_paths.insert(path.join("bin"));
        }
    }

    // 检测注册表
    let key_paths = [
        r"SOFTWARE\JavaSoft\Java Runtime Environment",
        r"SOFTWARE\JavaSoft\Java Development Kit",
        r"SOFTWARE\\JavaSoft\\JRE",
        r"SOFTWARE\\JavaSoft\\JDK",
        r"SOFTWARE\\Eclipse Foundation\\JDK",
        r"SOFTWARE\\Eclipse Adoptium\\JRE",
        r"SOFTWARE\\Eclipse Foundation\\JDK",
        r"SOFTWARE\\Microsoft\\JDK",
    ];

    for key in key_paths {
        if let Ok(java_key) = RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey_with_flags(key, KEY_READ | KEY_WOW64_32KEY) {
            java_paths.extend(get_java_in_register_key(java_key));
        }
        if let Ok(java_key) = RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey_with_flags(key, KEY_READ | KEY_WOW64_64KEY) {
            java_paths.extend(get_java_in_register_key(java_key));
        }
    }
    return java_paths;
}

// 获取注册表中的Java
#[cfg(target_os = "windows")]
fn get_java_in_register_key(java_key: RegKey) -> HashSet<PathBuf> {
    let mut java_paths = HashSet::new();
    for sub_key in java_key.enum_keys().flatten() {
        if let Ok(sub_key) = java_key.open_subkey(sub_key) {
            let sub_key_value_names = [r"JavaHome", r"InstallationPath", r"\\hotspot\\MSI"];
            for sub_key_value in sub_key_value_names {
                let path: Result<String, std::io::Error> = sub_key.get_value(sub_key_value);
                let Ok(path) = path else { continue; };
                java_paths.insert(PathBuf::from(path).join("bin"));
            }
        }
    }
    return check_java_at_filepaths(java_paths);
}

// MacOS
#[cfg(target_os = "macos")]
#[tauri::command]
fn get_java_paths() -> Option<HashSet<PathBuf>> {
    let mut java_paths = HashSet::new();

    // 检测环境变量
    java_paths.extend(get_java_in_path());

    // Java默认安装位置
    let java_installation_paths = [
        r"/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/MacOS/itms/java",
        r"/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home",
        r"/System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands",
    ];
    for path in java_installation_paths {
        java_paths.insert(PathBuf::from(path));
    }
    let base_path = PathBuf::from("/Library/Java/JavaVirtualMachines/");
    if let Ok(dir) = std::fs::read_dir(base_path) {
        for entry in dir.flatten() {
            let entry = entry.path().join("Contents/Home/bin");
            java_paths.insert(entry);
        }
    }
    return check_java_at_filepaths(java_paths);
}

// Linux
#[cfg(target_os = "linux")]
#[tauri::command]
fn get_java_paths() -> Option<HashSet<PathBuf>> {
    let mut java_paths = HashSet::new();

    // 检测环境变量
    java_paths.extend(get_java_in_path());

    // Java默认安装位置
    let java_installation_paths = [
        r"/usr",
        r"/usr/java",
        r"/usr/lib/jvm",
        r"/usr/lib64/jvm",
        r"/opt/jdk",
        r"/opt/jdks",
    ];
    for path in java_installation_paths {
        let path = PathBuf::from(path);
        java_paths.insert(PathBuf::from(&path).join("jre").join("bin"));
        java_paths.insert(PathBuf::from(&path).join("bin"));
        if let Ok(dir) = std::fs::read_dir(path) {
            for entry in dir.flatten() {
                let entry_path = entry.path();
                java_paths.insert(entry_path.join("jre").join("bin"));
                java_paths.insert(entry_path.join("bin"));
            }
        }
    }
    return check_java_at_filepaths(java_paths);
}

// 检测环境变量
fn get_java_in_path() -> HashSet<PathBuf> {
    let paths = env::var("PATH").map(|x| env::split_paths(&x).collect::<HashSet<_>>());
    return paths.unwrap_or_else(|_| HashSet::new());
}

// 检测是否为java
fn check_java_at_filepaths(paths: HashSet<PathBuf>) -> Option<HashSet<PathBuf>> {
    let mut java_paths = HashSet::new();
    for path in paths {
        // 路径是否存在
        let Ok(path) = canonicalize(path) else {
            continue;
        };

        // 检查是否为Java可执行文件，如果不存在则添加后缀
        #[cfg(target_os = "windows")]
            let java_bin = "java.exe";
        #[cfg(not(target_os = "windows"))]
            let java_bin = "java";

        let java_path = if path.file_name()?.to_str()? != java_bin {
            path.join(java_bin)
        } else {
            path.clone()
        };

        // 文件是否存在
        if java_path.exists() == true {
            java_paths.insert(java_path);
        }
    }
    return Some(java_paths);
}

/* 主函数 */
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![java_version, get_java_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
