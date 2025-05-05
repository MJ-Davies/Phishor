use actix_web::{web, App, HttpResponse, Scope};
use crate::handlers::{auth, openai, phishing_detection};

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/login", web::post().to(auth::login))
            .route("/register", web::post().to(auth::register))
            .route("/health", web::get().to(|| async { HttpResponse::Ok().body("Server is healthy") }))
    );
}