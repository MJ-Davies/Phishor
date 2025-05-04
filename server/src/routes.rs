use actix_web::{web, HttpResponse, Scope};
use crate::handlers::{auth, openai, phishing_detection};

pub fn configure_routes() -> Scope {
    web::scope("/api")
        .route("/login", web::post().to(auth::login))
        .route("/register", web::post().to(auth::register))
        // .route("/openai/chat", web::post().to(openai::chat))
        // .route("/phishing/detect", web::post().to(phishing_detection::detect))
        .route("/health", web::get().to(|| async { HttpResponse::Ok().body("Server is healthy") }))
}