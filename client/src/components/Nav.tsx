import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../css/index.css";

function Nav({ bgColor = "var(--color-primaryBgColorLight)" }) {
  const [isSmallNav, setIsSmallNav] = useState(false);
  const { isAuthenticated } = useAuth(); // Authentication state from context
  const [navButtonLabel, setNavButtonLabel] = useState("Login");
  const [navButtonLink, setNavButtonLink] = useState("/login");

  // Check if the page has been scrolled more than 10px
  useEffect(() => {
    const handleScroll = () => {
      setIsSmallNav(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update background color
  const body = document.querySelector("body");
  if (body) {
    body.style.backgroundColor = bgColor;
  }

  useEffect(() => {
    if (isAuthenticated) {
      setNavButtonLabel("Home");
      setNavButtonLink("/home");
    } else {
      setNavButtonLabel("Login");
      setNavButtonLink("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="nav_wrapper">
      <nav id="nav" className={isSmallNav ? "small_nav" : ""}>
        <ul id="nav_items">
          <li style={{ marginLeft: "0px" }}>
            <a href="/">Phishor</a>
          </li>
          <div className="nav_links">
            <li>
              <a href="/about">About</a>
            </li>
            <li style={{ marginRight: "0px" }}>
              <a href={navButtonLink}>{navButtonLabel}</a>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;