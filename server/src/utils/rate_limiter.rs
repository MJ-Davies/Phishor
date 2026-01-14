/* 
PURPOSE: Store functions for rate limiting a particular user with the leaky bucket method
TESTING NOTES: If we want to test that rate limiting works for one client, we do the following command in powershell:
                 1..15 | % { Write-Host -NoNewline "Request $_ : "; curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8000/api/health; Write-Host "" }
               If we want to test that different clients with different IPs get their own bucket by spoofing IP
               addresses, uncomment the spoofing section in rate_limiter_middleware.rs and do the following in
               powershell:
                 Write-Host "--- USER A (1.1.1.1) SPAMS ---"
                  curl.exe -s -o NUL -w "User A - Req 1: %{http_code}\n" -H "x-test-ip: 1.1.1.1" http://127.0.0.1:8000/api/health
                  curl.exe -s -o NUL -w "User A - Req 2: %{http_code}\n" -H "x-test-ip: 1.1.1.1" http://127.0.0.1:8000/api/health
                  curl.exe -s -o NUL -w "User A - Req 3: %{http_code}\n" -H "x-test-ip: 1.1.1.1" http://127.0.0.1:8000/api/health

                  Write-Host "`n--- USER B (2.2.2.2) TRIES ---"
                  curl.exe -s -o NUL -w "User B - Req 1: %{http_code}\n" -H "x-test-ip: 2.2.2.2" http://127.0.0.1:8000/api/health
                If we want to test that our leaky bucket actually leaks, we do the following in powershell:
                  Write-Host "--- STEP 1: FILL THE BUCKET ---"
                  curl.exe -s -o NUL -w "Req 1: %{http_code}\n" http://127.0.0.1:8000/api/health
                  curl.exe -s -o NUL -w "Req 2: %{http_code}\n" http://127.0.0.1:8000/api/health
  
                  Write-Host "`n--- STEP 2: WAIT FOR LEAK (2 Seconds) ---"
                  Start-Sleep -Seconds 2
  
                  Write-Host "--- STEP 3: VERIFY RECOVERY ---"
                  curl.exe -s -o NUL -w "Req 3: %{http_code}\n" http://127.0.0.1:8000/api/health
*/
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Instant};

/// The internal state of a single user's bucket
#[derive(Debug, Clone)] // Debug = allows debug prints, Clone = allows explicit dupe copy of data
struct LeakyBucket {
    capacity: f64,
    current_level: f64,
    last_checked: Instant,
    leak_rate: f64, // tokens leaked per second
}

impl LeakyBucket {
    // Purpose: Defines constructor for leaky bucket
    // Parameters: capacity (float) - capacity of bucket
    //             leak_rate (float) - rate at which bucket leaks
    // Returns: Self
    fn new(capacity: f64, leak_rate: f64) -> Self {
        Self {
            capacity,
            current_level: 0.0,
            last_checked: Instant::now(),
            leak_rate,
        }
    }

    // Purpose: Returns true if request is allowed, false if rejected
    // Parameters: Address to self (mutable)
    fn allow(&mut self) -> bool {
        let now = Instant::now();
        let elapsed = now.duration_since(self.last_checked).as_secs_f64();
        
        // Calculate how much water leaked since the last request
        let leaked = elapsed * self.leak_rate;

        // Update the level (cannot go below 0)
        self.current_level = (self.current_level - leaked).max(0.0);
        self.last_checked = now;

        // Try to add the new request (drop of size 1.0)
        if self.current_level + 1.0 <= self.capacity { // Accept req.
            self.current_level += 1.0;
            true 
        } else { // Reject req.
            false
        }
    }
}

// Thread-safe manager to hold buckets for ALL users
#[derive(Clone)]
pub struct RateLimiter {
    // Map of IP Address -> User's Bucket
    buckets: Arc<Mutex<HashMap<String, LeakyBucket>>>, // Arc<Mutex<...>> Allows map to be shared safely across web threads
    global_capacity: f64,
    global_leak_rate: f64,
}

impl RateLimiter {
    // Purpose: Constructor for rate limiter
    // Parameters: capacity (float) - capacity of bucket
    //             leak_rate (float) - rate at which bucket leaks
    // Returns: Self
    pub fn new(capacity: f64, leak_rate: f64) -> Self {
        Self {
            buckets: Arc::new(Mutex::new(HashMap::new())),
            global_capacity: capacity,
            global_leak_rate: leak_rate,
        }
    }

    // Purpose: Checks if request is is allowed; make a new bucket if first request
    // Parameters: Address to self
    //             ip_address (String) - String representing IP address of user
    // Returns: None
    pub fn check_request(&self, ip_address: &String) -> bool {
        let mut buckets = self.buckets.lock().unwrap();

        // Get the specific bucket for this IP, or create one if it's new
        let bucket = buckets.entry(ip_address.to_string()).or_insert_with(|| {
            LeakyBucket::new(self.global_capacity, self.global_leak_rate)
        });

        bucket.allow()
    }
}