/* 
PURPOSE: Store functions related to JWT authentication
NOTES: JWT tokens here are meant to authenticate users after they have logged in
       Ensures that the user can quickly log in, without reentering credentials, after 24 hours
*/
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

const SECRET: &[u8] = b"A STATIC KEY"; // Can be made dynamic in a future development

// Struct defining what a Claims is
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub exp: usize,  // Expiration timestamp
}

/// Purpose: Generates a JSON Web Token (JWT) for the user
/// Params: user_id(address to string) - the User ID that is getting the JWT generated
/// Returns: String
pub fn generate_token(user_id: &str) -> String {
    let expiration = Utc::now() + Duration::hours(24); // Token lasts 24 hours
    let claims = Claims { sub: user_id.to_string(), exp: expiration.timestamp() as usize };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET)).unwrap()
}

/// Purpose: Verifies the JWT to ensure it is valid
/// Params: token(address to string) - a JWT (valid or invalid)
/// Returns: Claims
pub fn verify_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let mut validation = Validation::default();
    validation.validate_exp = true; // Enforce expiration check

    decode::<Claims>(token, &DecodingKey::from_secret(SECRET), &validation).map(|data| data.claims)
}