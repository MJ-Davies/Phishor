/* 
PURPOSE: Store functions related to Gemini AI
*/
use reqwest::Client;
use serde_json::{json, Value};
use std::env;

// TEMPORARY IMPORTS for testing
// use std::time::Duration;
// use tokio::time::sleep;
// END OF TEMPORARY IMPORTS

// Purpose: Uses Gemini API to generate and return a response
// Parameters: messages (String) - user inputted messages of a conversation
// Returns: Result<String, String>
pub async fn analyze_conversation(messages: String) -> Result<String, String> {
    let api_key = env::var("GEMINI_API_KEY").map_err(|_| "GEMINI_API_KEY not set")?;
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={}",
        api_key
    );

    let client = Client::new();

    // Construct the prompt
    let prompt_text = format!(
        "Analyze the following conversation for signs of phishing. \
        Identify red flags, psychological manipulation, or technical anomalies. \
        Provide a risk score (Low/Medium/High) and a concise explanation. \
        Also provide a percentage in how likely the messages are to be phishing attempts.\n\n\
        Conversation:\n{}",
        messages
    );

    // Build the Gemini request body
    let body = json!({
        "contents": [{
            "parts": [{
                "text": prompt_text
            }]
        }]
    });

    // Send request
    let resp = client.post(&url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("Gemini API Error: {}", resp.status()));
    }

    // Parse Response
    let resp_json: Value = resp.json().await.map_err(|e| format!("Parse error: {}", e))?;
    
    // Extract the text from the nested JSON response
    let analysis = resp_json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .unwrap_or("No analysis returned")
        .to_string();

    Ok(analysis)

    // DUMMY RESPONSE so that Gemini API doesn't get rate limited when I need to test it later
    // Simulate a 2-second network delay so your frontend shows the "loading" state
    // sleep(Duration::from_secs(5)).await;

    // SUCCESS: Return a hardcoded "Phishing Detected" response
    // let dummy_response = "Risk Score: High\n\n\
    //     Explanation: This conversation exhibits clear indicators of a phishing attempt. \
    //     The sender creates a false sense of urgency ('act now') and threatens negative consequences ('lose funds'). \
    //     The request to click a link for verification is a standard credential harvesting tactic.\n\n\
    //     Likelihood: 95%".to_string();
    // Ok(dummy_response)
    
    // FAILURE: Return an error response explicitly
    // println!("Simulating Gemini API Failure...");
    // Err("Gemini API is currently down (Simulated 500 Error)".to_string())
    // END OF DUMMY RESPONSE
}