/* 
PURPOSE: Store functions related to JWT authentication
NOTES: JWT tokens here are meant to authenticate users after they have logged in
       Ensures that the user can quickly log in, without reentering credentials, after 24 hours
*/
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};
use actix_web::{web, HttpResponse, Responder};

const SECRET: &[u8] = b"A STATIC KEY"; // Can be made dynamic in a future development

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String, // User ID
    exp: usize,  // Expiration timestamp
}

/** 
Purpose: Generates a JSON Web Token (JWT) for the user
Params: user_id = the User ID that is getting the JWT generated
Returns: String
*/
pub fn generate_token(user_id: &str) -> String {
    let expiration = Utc::now() + Duration::hours(24); // Token lasts 24 hours
    let claims = Claims { sub: user_id.to_string(), exp: expiration.timestamp() as usize };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET)).unwrap()
}

/** 
Purpose: Verifies the JWT to ensure it is valid
Params: str = a JWT (valid or invalid)
Returns: Claims
*/
pub fn verify_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    decode::<Claims>(token, &DecodingKey::from_secret(SECRET), &Validation::default()).map(|data| data.claims)
}

/** 
Purpose: Checks that login is valid
Params: str = a JWT (valid or invalid)
Returns: response body
*/
pub async fn login(credentials: web::Form<(String, String)>) -> impl Responder {
    let (username, password) = credentials.into_inner();

    // TODO: Validate username and password against database (pseudo-code)
    let token = generate_token(&username);
    if username == "admin" && password == "password123" {
        return HttpResponse::Ok().body(token);
    }

    HttpResponse::Unauthorized().body("Invalid credentials")
}