/**
 * Purpose: Logs in a user by sending form-encoded credentials to the server.
 * Params: username - The username of the user trying to log in.
 *         password - The password of the user trying to log in.
 * Returns: A Promise that resolves to the login success status.
 */
export async function login(username: string, password: string): Promise<boolean> {
    try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Form data type
            body: formData.toString(), // Convert form data to a URL-encoded string
        });

        if (!response.ok) {
            console.error("Login failed");
            return false;
        }

        const data: { token: string } = await response.json();
        localStorage.setItem("jwt", data.token); // Store JWT

        return true; // Login successful
    } catch (error) {
        console.error("Error during login:", error);
        return false;
    }
}

/**
 * Purpose: Fetches data from a protected API route that requires JWT authentication.
 *          The function retrieves the JWT from local storage and includes it in the Authorization header.
 *
 * Params: None
 *
 * Returns: A Promise resolving to the response body as a JSON object.
 *
 * Notes: Call this function:
 *        - On page load
 *        - After user logs in
 *        - Before secured actions
 *        - When refreshing UI state
 */
export async function fetchProtectedData(): Promise<any> {
    const token = localStorage.getItem("jwt");

    if (!token) {
        console.error("No JWT token found.");
        return null;
    }

    try {
        const response = await fetch("http://localhost:8000/protected-route", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching protected data:", error);
        return null;
    }
}