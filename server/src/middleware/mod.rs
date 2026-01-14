/* 
MIDDLEWARE: Meant to store where requests are intercepted:
            - Modify requests
            - Enrich requests
            - Reject requests
            before reaching the handler
*/
pub mod auth_middleware;
pub mod rate_limiter_middleware;
pub mod security;