/* 
MIDDLEWARE: Meant to store where requests are intercepted:
            - Modify requests
            - Enrich requests
            - Reject requests
            before reaching the handler
*/
pub mod rate_limiter;
pub mod security;
pub mod auth_middleware;