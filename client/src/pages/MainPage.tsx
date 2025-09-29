import Nav from '../components/Nav.tsx'
import Footer from '../components/Footer.tsx'
import { useEffect, useState } from "react";
import "../css/main.css";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Purpose: Set the background color of the nav bar to the background color of the first section (cover_section)
  // Parameters: None
  // Returns: None
  useEffect (() => {
    const cover_section_element = document.getElementById("cover_section");
    if (cover_section_element) {
      setNavBgColor(getComputedStyle(cover_section_element).backgroundColor);
    }
  }, []);

  // Purpose: Change the cover_section height to account for the nav bar height
  // Parameters: None
  // Returns: None
  useEffect (() => {
    const cover_section_element = document.getElementById("cover_section");
    if (cover_section_element) {
      const nav_element = document.getElementById("nav");
      if (nav_element) {
        const nav_height = nav_element.clientHeight;
        cover_section_element.style.height = `calc(100vh - ${nav_height}px + 10px)`;
      }
    }
  }, []);

  return (
    <div>
      <Nav bgColor={navBgColor}/>
      {/* Cover section */}
      <section id="cover_section" className="light_section">
        <div className="cover_div">
          <div className="cover_text_div">
            <h1 className="cover_header">Life's too short to get <span>phished</span></h1>
          </div>
        </div>
      </section>
      {/* About section */}
      <section id="about_section" className="dark_section">
        <div className="about_div">
        <h1 className="header_underline">Why <span>Phishor?</span></h1>
          <p className="">Phishor is a tool that uses artificial intelligence to detect phishing attempts in your conversations. It is designed to be easy to use and accessible to everyone.</p>
          <p className="">It's as simple as:</p>
          <ol>
            <li>Uploading your conversation</li>
            <li>Get it analyzed by artificial intelligence</li>
            <li>Let AI tell you the likelihood of getting phished</li>
          </ol>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "50px 0" }}>
            <button onClick={handleLoginClick}>Start Now</button>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default MainPage
