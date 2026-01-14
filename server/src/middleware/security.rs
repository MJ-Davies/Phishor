/* 
PURPOSE: Store functions related to sanitiziation and validation (i.e. JWT validation)
*/
use actix_web::{Error, HttpRequest, HttpMessage};
use crate::utils::jwt::verify_token;


/// Purpose: Authenticate users based on the JWT passed in
/// Params: req(HttpRequest) - an HTTP request to verify a JWT token
/// Returns: req
pub async fn authenticate(req: &HttpRequest) -> Result<(), Error> {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("Missing or malformed token"))?;

    let claims = verify_token(token)
        .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid token"))?;

    println!("Authenticated user: {:?}", claims.sub);

    // Optional: inject claims into request extensions
    req.extensions_mut().insert(claims);

    Ok(())
}