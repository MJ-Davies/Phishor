/* 
PURPOSE: Store functions related to Gemini AI, entrypoint for AI feedback
*/
use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use crate::utils::gemini::analyze_conversation;

// Input structure matching frontend's 'items' array
#[derive(Deserialize, Serialize, Debug)]
pub struct MessageItem {
    pub user: String,
    pub message: String,
}

// List of all messages inputted by user
#[derive(Deserialize)]
pub struct AnalysisRequest {
    pub history: Vec<MessageItem>,
}

// Purpose: Calls Gemini util to generate and return a response
// Parameters: req_body (Json<AnalysisRequest) - request body
// Returns: Responder
pub async fn analyze_phishing(req_body: web::Json<AnalysisRequest>) -> impl Responder {
    // Format the conversation into a readable string
    let conversation_str = req_body.history.iter()
        .map(|item| format!("{}: {}", item.user, item.message))
        .collect::<Vec<String>>()
        .join("\n");
    println!("Conversation History from user: {}", conversation_str);

    // Call the Gemini Utility
    match analyze_conversation(conversation_str).await {
        Ok(analysis) => HttpResponse::Ok().json(serde_json::json!({ "feedback": analysis })),
        Err(err) => {
            eprintln!("Gemini Error: {}", err);
            HttpResponse::InternalServerError().body("Failed to analyze conversation")
        }
    }
}