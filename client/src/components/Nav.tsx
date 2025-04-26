import { useEffect, useState } from "react";
import "../css/index.css";

function Nav({
  bgColor = "var(--color-primaryBgColorLight)"
}) {
  const [isSmallNav, setIsSmallNav] = useState(false);

  // Check if the page has been scrolled more than 10px, if it has then change nav state
  useEffect(() => {
    const handleScroll = () => {
      setIsSmallNav(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const body = document.querySelector("body");
  if (body) {
    body.style.backgroundColor = bgColor;
  }


    return (
      <div className="nav_wrapper">
        <nav id="nav" className={isSmallNav ? "small_nav" : ""}>
          <ul id="nav_items" className="">
            <li style={{marginLeft: "0px"}}><a href="/">Phishor</a></li>
            <div className="nav_links">
              <li><a href="/about">About</a></li>
              <li style={{marginRight: "0px"}}><a href="/login">Login</a></li>
            </div>
          </ul>
        </nav>
      </div>
    )
  }
  
  export default Nav