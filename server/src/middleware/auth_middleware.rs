/* 
PURPOSE: Wrapper for authenticating users
*/
use actix_service::{Service, Transform};
use actix_web::{dev::{ServiceRequest, ServiceResponse}, Error};
use futures::future::{ok, Ready, LocalBoxFuture};
use std::rc::Rc;
use crate::middleware::security::authenticate;

pub struct AuthMiddleware;

// Tell Actix how to wrap authenticate with MiddleWare
impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareService<S>; // The actual middleware service tha wraps the original
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    // The wrapper around the service, we use Rc to allow shared ownership across async boundaries
    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthMiddlewareService {
            service: Rc::new(service),
        })
    }
}

// Holds wrapped service logic
pub struct AuthMiddlewareService<S> {
    service: Rc<S>,
}

// Define middleware behaviour
impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    // Ensure that service is ready to handle a request
    fn poll_ready(
        &self,
        ctx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    // The logic of our wrapper, runs on every request
    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = self.service.clone();

        Box::pin(async move {
            match authenticate(req.request()).await {
                Ok(_) => service.call(req).await,
                Err(e) => Err(e),
            }
        })
    }
}