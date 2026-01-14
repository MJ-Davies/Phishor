use actix_web::{web, HttpResponse};
use crate::handlers::{auth, openai};

// Import middleware wrappers
use crate::middleware::auth_middleware::AuthMiddleware;
use crate::middleware::rate_limiter_middleware::RateLimitMiddleware;

/// Purpose: Configure the API endpoints to correspond to various functions
///          Runs rate limiter, then authentication, and then handler
/// Parameters: cfg(ServiceConfig) - A reference to the server configurations
/// Return: None
pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .wrap(RateLimitMiddleware::new())
            .route("/login", web::post().to(auth::login))
            .route("/register", web::post().to(auth::register))
            .route("/health", web::get().to(|| async { HttpResponse::Ok().body("Server is healthy") }))
            // We ensure that we are always authenticated in the backend
            .service(
                web::scope("/protected")
                    .wrap(AuthMiddleware)
                    .route("", web::get().to(|| async {
                        HttpResponse::Ok().body("You are authenticated!")
                    }))
            )
    );
}