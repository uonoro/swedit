// 1. Zuerst das Modul deklarieren, damit Rust die Datei findet!
mod ftp_manager; 

// 2. Die Typen importieren
use crate::ftp_manager::{FtpManager, FtpFile};

#[tauri::command]
async fn ftp_connect(
    manager: tauri::State<'_, FtpManager>,
    host: String,
    port: u16,
    user: String,
    pass: String,
) -> Result<String, String> {
    manager.connect(&host, port, &user, &pass)
}

#[tauri::command]
async fn ftp_list(
    manager: tauri::State<'_, FtpManager>,
    path: String,
) -> Result<Vec<FtpFile>, String> {
    manager.list_directory(&path)
}

#[tauri::command]
async fn ftp_read_file(
    manager: tauri::State<'_, FtpManager>,
    path: String,
    as_base64: bool,
) -> Result<String, String> {
    manager.read_file(&path, as_base64)
}

#[tauri::command]
async fn ftp_download(
    manager: tauri::State<'_, FtpManager>,
    remote_path: String,
    local_dest: String,
) -> Result<(), String> {
    manager.download_to_disk(&remote_path, &local_dest)
}

#[tauri::command]
async fn ftp_disconnect(
    manager: tauri::State<'_, FtpManager>
) -> Result<(), String> {
    manager.disconnect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let ftp_manager = FtpManager::new();
    tauri::Builder::default()
        // 3. Ganz wichtig: Den Manager initialisieren und registrieren!
        .manage(ftp_manager) 
        .invoke_handler(tauri::generate_handler![
            ftp_connect,
            ftp_list,
            ftp_read_file,
            ftp_download,
            ftp_disconnect
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}