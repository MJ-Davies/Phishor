import Nav from '../components/Nav.tsx'
import Footer from '../components/Footer.tsx'
import { useEffect, useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");

  const handleLoginClick = () => {
    navigate("/");
  };

  // Set the background color of the nav bar to the background color of the first section (cover_section)
  useEffect (() => {
    const login_section_element = document.getElementById("login_section");
    if (login_section_element) {
      setNavBgColor(getComputedStyle(login_section_element).backgroundColor);
    }
  }, []);

  // Toggle the password input field to view the password
  const handlePasswordToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevents form submission
    const password_input = document.getElementById("password") as HTMLInputElement;
    if (password_input.type === "password") {
      password_input.type = "text";
    } else {
        password_input.type = "password";
    }
  };

  return (
    <div>
        <Nav bgColor={navBgColor}/>
        {/* Login section */}
        <section id="login_section" className="">
          <div className="login_div dark_section">
            <div>
              <h1 className="">Login to Phishor</h1>
              <form id="login_form" action="/login" method="POST">
                <label htmlFor="username" className="hidden-label">Username</label>
                <input type="username" id="username" name="username" placeholder="Username" required/>
                <div className="password_container">
                  <label htmlFor="password" className="hidden-label">Password</label>
                  <input type="password" id="password" name="password" placeholder="Password" required/>
                  <div id="toggle_password" className="icon">
                    <button className="no_style" onClick={handlePasswordToggle}>
                      <img src='../../eye_icon.svg' width="50" height="50" alt="view_password_icon"/>
                    </button>
                  </div>
                </div>
                <button type="submit" onClick={handleLoginClick}>Login</button>
              </form>
              <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
          </div>
        </section>
        <Footer/>
    </div>
  )
}

export default LoginPage;