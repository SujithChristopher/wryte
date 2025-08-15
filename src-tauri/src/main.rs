// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::{command, generate_context, generate_handler, Builder, AppHandle, Manager};

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn save_document_to_file(content: String, file_path: String) -> Result<String, String> {
    match fs::write(&file_path, content) {
        Ok(_) => Ok(format!("Document saved to: {}", file_path)),
        Err(e) => Err(format!("Failed to save file: {}", e)),
    }
}

#[command]
fn load_document_from_file(file_path: String) -> Result<String, String> {
    match fs::read_to_string(&file_path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to load file: {}", e)),
    }
}

#[command]
fn save_document(content: String) -> Result<String, String> {
    use std::env;
    let home_dir = env::var("HOME").unwrap_or_else(|_| ".".to_string());
    let default_path = format!("{}/wryte_document.html", home_dir);
    
    match fs::write(&default_path, content) {
        Ok(_) => Ok(format!("Document saved to: {}", default_path)),
        Err(e) => Err(format!("Failed to save file: {}", e)),
    }
}

#[command]
fn load_document() -> Result<String, String> {
    use std::env;
    let home_dir = env::var("HOME").unwrap_or_else(|_| ".".to_string());
    let default_path = format!("{}/wryte_document.html", home_dir);
    
    match fs::read_to_string(&default_path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to load file: {}", e)),
    }
}

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![greet, save_document, load_document, save_document_to_file, load_document_from_file])
        .run(generate_context!())
        .expect("error while running tauri application");
}