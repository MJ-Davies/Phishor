/**
 * Purpose: Fetches data from a protected API route that requires JWT authentication.
 *          The function retrieves the JWT from local storage and includes it in the Authorization header.
 *          If the JWT is authorized, then protected data is fetched from the backend (this has no use right now since there is no data tied to an account yet)
 *
 * Params: None
 *
 * Returns: A Promise resolving to the response body as a JSON object or null if no token is found
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
        const response = await fetch("http://localhost:8000/api/protected-route", {
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