use actix_web::{web, get, HttpServer, App, Responder, HttpResponse};
use actix_cors::Cors;
use routes::configure_routes;

mod routes;
mod db;
mod handlers;
mod middleware;
mod utils;

// Purpose: Initialize and run the backend server
// Parameters: None
// Returns: None
#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Initializing the server...");

    let server = HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .configure(configure_routes) // Attach route configurations
    })
    .bind(("127.0.0.1", 8000))?;
    println!("Server is running on port 8000");
    server.run().await;
    Ok(())
}