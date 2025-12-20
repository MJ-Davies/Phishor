use actix_web::{web, HttpResponse};
use crate::handlers::{auth, openai};
use crate::middleware::auth_middleware::AuthMiddleware;

/// Purpose: Configure the API endpoints to correspond to various functions
/// Parameters: cfg(ServiceConfig) - A reference to the server configurations
/// Return: None
pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
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