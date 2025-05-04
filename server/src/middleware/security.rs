/* 
PURPOSE: Store functions related to sanitiziation and validation (i.e. JWT validation)
*/
use actix_web::{Error, HttpRequest, HttpResponse};
use crate::utils::jwt::verify_token;

/** 
Purpose: Authenticate users based on the JWT passed in
Params: req: an HTTP request to obtain the JWT
Returns: req
*/
pub async fn authenticate(req: HttpRequest) -> Result<HttpRequest, Error> {
    if let Some(auth_header) = req.headers().get("Authorization") {
        if let Ok(token) = auth_header.to_str() {
            if let Ok(claims) = verify_token(token.trim_start_matches("Bearer ")) {
                println!("Authenticated user");
                return Ok(req);
            }
        }
    }
    Err(actix_web::error::ErrorUnauthorized("Invalid token"))
}