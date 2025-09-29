import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Nav from "../components/Nav.tsx";
import Footer from "../components/Footer.tsx";
import "../css/login.css";

function LoginPage() {
  const navigate = useNavigate();
  const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useAuth();

  // Purpose: Handle login request
  // Parameters: event(React.FormEvent) - Event on form submit
  // Returns: None
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Send to backend server as a form
        body: formData.toString(),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwt", token);
        setMessage("Login successful!");
        setIsAuthenticated(true); // Manually update authentication context
        navigate("/home");
      } else {
        const errorText = await response.text();
        setMessage(`Login failed: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error connecting to the server. ${error}`);
      console.error(error);
    }
  };

  return (
    <div>
      <Nav bgColor={navBgColor} />
      <section id="login_section" className="">
        <div className="login_div dark_section">
          <div>
            <h1>Login to Phishor</h1>
            <form id="login_form" onSubmit={handleLogin}>
              <label htmlFor="username" className="hidden-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="password_container">
                <label htmlFor="password" className="hidden-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div id="toggle_password" className="icon">
                  <button
                    className="no_style"
                    onClick={(e) => {
                      e.preventDefault();
                      const passwordInput = document.getElementById("password") as HTMLInputElement;
                      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
                    }}
                  >
                    <img src="../../eye_icon.svg" width="50" height="50" alt="view_password_icon" />
                  </button>
                </div>
              </div>
              <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p>
            <p style={{color: "red", fontWeight: "bold"}}>{message}</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LoginPage;