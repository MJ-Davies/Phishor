use actix_web::{web, HttpRequest, HttpResponse, Error};
use crate::handlers::{auth, openai, phishing_detection};
use crate::middleware::security::authenticate;

// Purpose: Configure the API endpoints to correspond to various functions
// Parameters: cfg(ServiceConfig) - A reference to the server configurations
// Return: None
pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/login", web::post().to(auth::login))
            .route("/register", web::post().to(auth::register))
            .route("/protected", web::get().to(protected_route))
            .route("/health", web::get().to(|| async { HttpResponse::Ok().body("Server is healthy") }))
    );
}

// Purpose: Define protected route requiring authentication
// Parameters: req(HttpRequest) - HTTP request to validate JWT token
// Returns: None
async fn protected_route(req: HttpRequest) -> Result<HttpResponse, Error> {
    match authenticate(req).await {
        Ok(_) => Ok(HttpResponse::Ok().body("You are authenticated!")),
        Err(_) => Err(actix_web::error::ErrorUnauthorized("Invalid or expired token")),
    }
}