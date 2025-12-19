use suppaftp::FtpStream;
use serde::Serialize;
use std::sync::{Arc, Mutex};
use std::io::Read;
use std::fs::File;
use base64::{Engine as _, engine::general_purpose};

#[derive(Serialize)]
pub struct FtpFile {
    pub name: String,
    pub size: u64,
    pub is_directory: bool,
}

pub struct FtpManager {
    // Der Stream wird hier sicher für die gesamte Session gespeichert
    pub stream: Arc<Mutex<Option<FtpStream>>>,
}

impl FtpManager {
    pub fn new() -> Self {
        Self {
            stream: Arc::new(Mutex::new(None)),
        }
    }

    // 1. VERBINDEN & LOGIN (Ersetzt test_connection)
   pub fn connect(&self, host: &str, port: u16, user: &str, pass: &str) -> Result<String, String> {
    let mut client = FtpStream::connect(format!("{}:{}", host, port))
        .map_err(|e| format!("Verbindungsfehler: {}", e))?;

    client.login(user, pass)
        .map_err(|e| format!("Login fehlgeschlagen: {}", e))?;

   let msg = client.get_welcome_msg().unwrap_or("Erfolgreich verbunden").to_string();
    println!("FTP Verbindungsnachricht: {}", msg);

    client.set_mode(suppaftp::Mode::Passive);

    let mut lock = self.stream.lock().map_err(|_| "Mutex Lock Fehler")?;
    *lock = Some(client);

    Ok(msg)
}

    // 2. VERZEICHNIS LISTEN
    pub fn list_directory(&self, path: &str) -> Result<Vec<FtpFile>, String> {
        let mut lock = self.stream.lock().map_err(|_| "Mutex Lock Fehler")?;
        let stream = lock.as_mut().ok_or("Nicht verbunden")?;

        // Pfad wechseln
        if !path.is_empty() && path != "/" {
            stream.cwd(path).map_err(|e| format!("Pfad-Fehler: {}", e))?;
        }

        let lines = stream.list(None).map_err(|e| e.to_string())?;
        
        let file_list = lines.iter().map(|line| {
            let is_dir = line.starts_with('d');
            let parts: Vec<&str> = line.split_whitespace().collect();
            let name = parts.last().unwrap_or(&"unknown").to_string();
            let size = parts.get(4).unwrap_or(&"0").parse::<u64>().unwrap_or(0);

            FtpFile { name, size, is_directory: is_dir }
        }).collect();

        Ok(file_list)
    }

    // 3. DATEI LESEN (Editor oder Media)
    pub fn read_file(&self, path: &str, as_base64: bool) -> Result<String, String> {
        let mut lock = self.stream.lock().map_err(|_| "Mutex Lock Fehler")?;
        let stream = lock.as_mut().ok_or("Nicht verbunden")?;

        let mut reader = stream.retr_as_buffer(path)
            .map_err(|e| format!("FTP Download Fehler: {}", e))?;
        
        let mut buffer = Vec::new();
        reader.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

        if as_base64 {
            Ok(general_purpose::STANDARD.encode(buffer))
        } else {
            String::from_utf8(buffer)
                .map_err(|_| "Dateiinhalt ist kein gültiges UTF-8 (Eventuell Binärdatei?)".to_string())
        }
    }

    // 4. DATEI DOWNLOAD (Lokal speichern)
    pub fn download_to_disk(&self, remote_path: &str, local_dest: &str) -> Result<(), String> {
        let mut lock = self.stream.lock().map_err(|_| "Mutex Lock Fehler")?;
        let stream = lock.as_mut().ok_or("Nicht verbunden")?;

        let mut reader = stream.retr_as_buffer(remote_path)
            .map_err(|e| format!("FTP Transfer Fehler: {}", e))?;

        let mut file = File::create(local_dest)
            .map_err(|e| format!("Lokale Datei konnte nicht erstellt werden: {}", e))?;

        std::io::copy(&mut reader, &mut file)
            .map_err(|e| format!("Schreibfehler auf Festplatte: {}", e))?;

        Ok(())
    }

    // 5. DISCONNECT
    pub fn disconnect(&self) -> Result<(), String> {
        let mut lock = self.stream.lock().map_err(|_| "Mutex Lock Fehler")?;
        if let Some(mut stream) = lock.take() {
            let _ = stream.quit();
        }
        Ok(())
    }
}