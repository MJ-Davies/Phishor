/* 
PURPOSE: Store functions related to JWT authentication, entry point for authentication
NOTES: JWT tokens here are meant to authenticate users after they have logged in
       Ensures that the user can quickly log in, without reentering credentials, after 24 hours
*/
use actix_web::{web, HttpResponse, Responder};
use crate::utils::jwt::generate_token;
use serde::Deserialize;
use std::collections::HashMap; // Temporary in-memory storage for example
use lazy_static::lazy_static; // Temporary in-memory storage for example
use std::sync::Mutex; // Temporary in-memory storage for example

// In a real scenario, we would use a SQL database with encrypted passwords
lazy_static! {
    static ref USERS: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

// Define form struct for a register form
#[derive(Debug, Deserialize)]
pub struct RegisterForm {
    username: String,
    password: String,
}


/// Purpose: Handles user registration.
/// Params: credentials(RegisterForm) - Registration credentials containing username and password
/// Returns: HTTP response with success or failure message.
pub async fn register(credentials: web::Form<RegisterForm>) -> impl Responder {
    let mut users = USERS.lock().unwrap();

    println!("Registering user...");

    if users.contains_key(&credentials.username) {
        println!("Username already exists, register unsuccessful");
        return HttpResponse::Conflict().body("Username already exists");
    }

    // TODO: Store user securely (hash passwords in real implementation)
    users.insert(credentials.username.clone(), credentials.password.clone());
    println!("Successfully created user, generating JSON Web Token...");
    let token = generate_token(&credentials.username);
    println!("JSON Web Token successfully generated");
    HttpResponse::Created().body(token)
}


/// Purpose: Checks that login is valid
/// Params: credentials(RegisterForm) - Login credentials containing username and password
/// Returns: response body
pub async fn login(credentials: web::Form<RegisterForm>) -> impl Responder {
    let users = USERS.lock().unwrap();
    
    println!("Checking if username exists");
    match users.get(&credentials.username) {
        Some(saved_password) if saved_password == &credentials.password => {
            println!("Password matches username, generating JSON Web Token...");
            let token = generate_token(&credentials.username);
            println!("JSON Web Token was successfully generated");
            HttpResponse::Ok().body(token)
        }
        _ => {
            println!("Credentials are invalid");
            HttpResponse::Unauthorized().body("Invalid username or password")
        }
    }
}