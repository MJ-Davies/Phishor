/* 
PURPOSE: Store functions related to JWT authentication
NOTES: JWT tokens here are meant to authenticate users after they have logged in
       Ensures that the user can quickly log in, without reentering credentials, after 24 hours
*/
use actix_web::{web, HttpResponse, Responder};
use crate::utils::jwt::generate_token;
use serde::Deserialize;
use std::collections::HashMap; // Temporary in-memory storage for example
use lazy_static::lazy_static; // Temporary in-memory storage for example
use std::sync::Mutex; // Temporary in-memory storage for example

// Temporary storage (replace with a real database)
lazy_static! {
    static ref USERS: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

#[derive(Debug, Deserialize)]
pub struct RegisterForm {
    username: String,
    password: String,
}

/**
 * Purpose: Handles user registration.
 * Params: request = Contains username and password.
 * Returns: HTTP response with success or failure message.
 */
pub async fn register(credentials: web::Form<RegisterForm>) -> impl Responder {
    let mut users = USERS.lock().unwrap();

    println!("Registering user...");

    if users.contains_key(&credentials.username) {
        return HttpResponse::Conflict().body("Username already exists");
    }

    // TODO: Store user securely (hash passwords in real implementation)
    users.insert(credentials.username.clone(), credentials.password.clone());

    let token = generate_token(&credentials.username);
    HttpResponse::Created().body(token)
}

/** 
Purpose: Checks that login is valid
Params: str = a JWT (valid or invalid)
Returns: response body
*/
pub async fn login(credentials: web::Form<(String, String)>) -> impl Responder {
    let (username, password) = credentials.into_inner();
    let users = USERS.lock().unwrap();

    // Check if the username exists and the password matches
    match users.get(&username) {
        Some(stored_password) if stored_password == &password => {
            let token = generate_token(&username);
            return HttpResponse::Ok().body(token);
        }
        _ => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}