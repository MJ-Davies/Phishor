/* 
PURPOSE: Store logic for rate limiting a particular user with the leaky bucket method
*/
use std::time::{Instant, Duration};

pub struct LeakyBucket {
    pub capacity: usize,
    pub current_level: f64,
    pub last_checked: Instant,
    pub leak_rate: f64, // tokens per second
}

impl LeakyBucket {
    pub fn allow(&mut self) -> bool {
        let now = Instant::now();
        let elapsed = now.duration_since(self.last_checked).as_secs_f64();
        let leaked = elapsed * self.leak_rate;

        self.current_level -= leaked;
        if self.current_level < 0.0 {
            self.current_level = 0.0;
        }
        self.last_checked = now;

        if self.current_level < self.capacity as f64 {
            self.current_level += 1.0;
            true
        } else {
            false
        }
    }
}

/// Purpose: Add an incoming request to the buffer
/// Parameters: None?
/// Returns: HTTP Error if buffer is too full
/// Note: We reject requests rather than queue
pub async fn add_request() {
    // For each request that comes in, add to buffer
    // Check if the buffer is too full
    // If buffer is too full, return an HTTP error
}

/// Purpose: Remove a request from buffer every 1 second
/// Parameters: None
/// Returns: None
pub async fn remove_request() {
    // If a request exists in buffer, wait 1 second before removing it
}