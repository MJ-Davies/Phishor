/* 
PURPOSE: Wrapper for rate limiter
*/
use std::future::{ready, Ready};
use futures::future::{LocalBoxFuture};
use actix_web::{
    body::{BoxBody, MessageBody}, // <--- Add MessageBody here
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpResponse,
};

use crate::utils::rate_limiter::RateLimiter; 

// Tell Actix how to wrap RateLimiter with MiddleWare
#[derive(Clone)]
pub struct RateLimitMiddleware {
    limiter: RateLimiter, 
}

// Holds wrapped service logic
impl RateLimitMiddleware {
    pub fn new() -> Self {
        Self {
            // Capacity 10 requests, refilling at 2 requests per second
            limiter: RateLimiter::new(10.0, 2.0),
        }
    }
}

// Define middleware behaviour
impl<S, B> Transform<S, ServiceRequest> for RateLimitMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static + MessageBody,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type InitError = ();
    type Transform = RateLimitMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RateLimitMiddlewareService {
            service,
            limiter: self.limiter.clone(),
        }))
    }
}

// Implement actual execution logic of the middleware
pub struct RateLimitMiddlewareService<S> {
    service: S,
    limiter: RateLimiter,
}

impl<S, B> Service<ServiceRequest> for RateLimitMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static + MessageBody,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    // Ensure that service is ready to handle a request
    fn poll_ready(&self, ctx: &mut core::task::Context<'_>) -> std::task::Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    // The logic of our wrapper, runs on every request
    fn call(&self, req: ServiceRequest) -> Self::Future {
        let limiter = self.limiter.clone();
        
        let client_ip = req.peer_addr()
            .map(|a| a.ip().to_string())
            .unwrap_or_else(|| "unknown".to_string());
        
        // START: Allows for spoofed IP addresses for testing
        // let real_ip = req.peer_addr()
        //     .map(|a| a.ip().to_string())
        //     .unwrap_or_else(|| "unknown".to_string());

        // let client_ip = req.headers()
        //     .get("x-test-ip")
        //     .and_then(|val| val.to_str().ok())
        //     .map(|s| s.to_string())
        //     .unwrap_or(real_ip); // Fallback to real IP if header is missing
        // END

        // This block now works perfectly because check_request is sync and returns bool
        let is_allowed = limiter.check_request(&client_ip);

        // Request not allowed
        if !is_allowed {
            println!("Client {} is getting rate limited.", client_ip);
            return Box::pin(async {
                Ok(req.into_response(HttpResponse::TooManyRequests()
                                        .body("Rate limit exceeded. Please wait a moment before trying again.")))
            });
        }

        // Request allowed
        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            Ok(res.map_into_boxed_body())
        })
    }
}