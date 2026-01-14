use actix_web::{HttpServer, App};
use actix_cors::Cors;
use actix_web::http::header;
use routes::configure_routes;

mod routes;
mod handlers;
mod middleware;
mod utils;

/// Purpose: Initialize and run the backend server
/// Parameters: None
/// Returns: None
#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Initializing the server...");

    let server = HttpServer::new(|| {

        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:5173")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE])
                    .max_age(3600),
            )
            .configure(configure_routes) // Attach route configurations
    })
    .workers(1) // Forces single thread, used to test rate limiting
    .bind(("127.0.0.1", 8000))?;
    println!("Server is running on port 8000");
    server.run().await?;
    Ok(())
}