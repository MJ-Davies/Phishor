use actix_web::{web, get, HttpServer, App, Responder, HttpResponse};
use actix_web::web::Path;
use routes::configure_routes;

// One endpoint with get method
#[get("/home")]
async fn home() -> impl Responder {
    let response: &str = "Welcome to Actix Web Server";
    HttpResponse::Ok().body(response)
}

// One endpoint with get method
#[get("/hello/{firstname}/{lastname}")]
async fn hello_user(params: Path<(String, String)>) -> impl Responder {
    let response: String = format!("Hello {} {}", params.0, params.1);
    HttpResponse::Ok().body(response)
}
mod routes;
mod db;
mod handlers;
mod middleware;
mod utils;

// use handlers::auth;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Initializing the server...");

    HttpServer::new(|| {
        App::new()
            .configure(configure_routes) // Attach route configurations
            .service(home)
            .service(hello_user)
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await?;

    println!("Server is running on port 8000");
    Ok(())
}