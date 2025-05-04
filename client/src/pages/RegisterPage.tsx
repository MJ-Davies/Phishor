import Nav from '../components/Nav.tsx';
import Footer from '../components/Footer.tsx';
import { useEffect, useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const login_section_element = document.getElementById("login_section");
    if (login_section_element) {
      setNavBgColor(getComputedStyle(login_section_element).backgroundColor);
    }
  }, []);

  const handlePasswordToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const password_input = document.getElementById("password") as HTMLInputElement;
    password_input.type = password_input.type === "password" ? "text" : "password";
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwt", token);
        setMessage("Registration successful!");
        navigate("/"); // Redirect after successful registration
      } else {
        const errorText = await response.text();
        setMessage(`Registration failed: ${errorText}`);
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
      console.error(error);
    }
  };

  return (
    <div>
      <Nav bgColor={navBgColor} />
      <section id="login_section" className="">
        <div className="login_div dark_section">
          <div>
            <h1>Register an account with Phishor</h1>
            <form id="register_form" onSubmit={handleRegister}>
              <label htmlFor="username" className="hidden-label">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
              <div className="password_container">
                <label htmlFor="password" className="hidden-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <div id="toggle_password" className="icon">
                  <button className="no_style" onClick={handlePasswordToggle}>
                    <img src='../../eye_icon.svg' width="50" height="50" alt="view_password_icon" />
                  </button>
                </div>
              </div>
              <button type="submit">Register</button>
            </form>
            <p style={{color: "red", fontWeight: "bold"}}>{message}</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default RegisterPage;