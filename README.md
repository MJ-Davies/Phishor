# Phishor 🛡️
### AI-Powered Social Engineering Detection Platform
*Created by MJ Davies - [LinkedIn](https://www.linkedin.com/in/mjdavi/)*

**Phishor** is a full-stack security application designed to detect and analyze social engineering attacks in real-time. By leveraging **Google Gemini 2.0 Flash**, it analyzes conversation history for psychological manipulation patterns, urgency cues, and sentiment anomalies, providing users with a quantifiable "Risk Score" and actionable feedback.

This project showcases a high-performance **Rust** backend, a type-safe **React** frontend, and a custom implementation of stateless **JWT authentication** and **rate-limiting algorithms**.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| --- | --- | --- |
| **Backend** | **Rust** (Actix Web + Tokio) | Chosen for memory safety, zero-cost abstractions, and high-concurrency performance. |
| **Frontend** | **React + Vite** and **TypeScript** | Ensures type safety across the UI; utilizes **React Router** for protected navigation. |
| **AI Engine** | **Google Gemini 2.0 Flash** | Large Language Model tuned for sentiment analysis and threat detection. |
| **Security** | **JWT** (JSON Web Tokens) | Stateless authentication mechanism for scalable session management. |

---

## 📸 Demos

### 1. AI Phishing Analysis

*Users submit message logs, and the system utilizes Gemini to perform a sentiment and risk analysis, rendering the output in a structured, easy-to-read format.*

![Demonstration of AI-generated response from Gemini analyzing phishing messages](https://github.com/MJ-Davies/Phishor/blob/main/media/gemini.gif?raw=true)

### 2. Secure Authentication Flow

*Full-stack registration and login flow with error handling and secure session management.*

![Demonstration of authentication when logging in as a user after registering](https://github.com/MJ-Davies/Phishor/blob/main/media/jwt.gif?raw=true)

### 3. Rate Limiting in Action

*Demonstrating the custom Leaky Bucket middleware preventing abuse by capping requests at 100 req/sec.*

![Demonstration of rate limiting by spamming "login" button](https://github.com/MJ-Davies/Phishor/blob/main/media/rate_limit.gif?raw=true)

---

## 🔐 Deep Dive: Implementation Details

### 1. Stateless JWT Authentication

Instead of using server-side sessions (which require database lookups for every request), Phishor implements a **Stateless Authentication** architecture.

* **Issuance:** Upon successful login, the Rust backend signs a JSON Web Token (JWT) using a secret key. This token contains the user's identity (Claims) and an expiration time.
* **Verification Middleware:** I implemented a custom `Actix Web` middleware `FromRequest` trait. For every protected route (e.g., `/api/analyze`), this middleware:
1. Intercepts the HTTP request.
2. Extracts the `Bearer` token from the `Authorization` header.
3. Cryptographically verifies the signature.
4. Decodes the payload to identify the user *before* the request ever hits the controller.



### 2. Leaky Bucket Rate Limiting

To protect the Gemini API quota and prevent DoS attacks, I engineered a custom rate-limiting middleware in Rust using the **Leaky Bucket algorithm**.

* **The Problem:** Token buckets allow "bursts" of traffic that can overwhelm downstream services.
* **The Solution:** The Leaky Bucket algorithm processes requests at a constant, fixed rate.
* **Implementation:** The middleware tracks the last request time for each IP address. If requests arrive faster than the "leak rate" (processing rate), the bucket fills up. Once full, subsequent requests are immediately rejected with `429 Too Many Requests` until the bucket drains.

### 3. AI Prompt Engineering

The core value of Phishor is its ability to distinguish between a "friendly stranger" and a "social engineer." The prompt engineering for Gemini focuses on:

* **Urgency Detection:** Flagging words that demand immediate action (e.g., "right now", "expires soon").
* **Authority Bias:** Identifying attempts to impersonate authority figures (e.g., "CEO", "Bank Manager").
* **Isolation:** Detecting attempts to move the conversation to a secondary, unmonitored channel (e.g., "message me on WhatsApp").

---

## 🔮 Future Improvements

* **Redis Integration:** Move the in-memory rate limiter to Redis to support distributed rate limiting across multiple server instances.
* **HttpOnly Cookies:** Migrate JWT storage from the client side to strictly `HttpOnly` cookies to further mitigate XSS risks.
* **CSRF Tokens:** Integrate CSRF tokens to prevent cross site request forgery attempts and better protect API endpoints.
* **Conversation Import:** Allow users to upload a screenshot rather than manually input message history and have an algorithmic or AI image parser to extract text conversations.
* **SQL Database + Encryption:** Store hashed passwords in an SQL database that persists between boots.
* **Rate Limiting on Global Scope:** Current implementation of rate limiting is by IP address which is insufficient if the web app experiences a DDoS attack; therefore, implementing a global rate limiter or using a third party like CloudFlare would be more secure.

---

## 🚀 Getting Started Locally

### Prerequisites

* Rust (Cargo)
* Node.js & npm
* A Google Gemini API Key

To run Phishor on your local machine, run the `.bat` script if you're on Windows. If you're on Mac or Linux, follow similar steps used in the .bat script.

A Google Gemini API Key must be added in a `.env` file with `GEMINI_API_KEY=<your API key>` in the server folder.

---

 
