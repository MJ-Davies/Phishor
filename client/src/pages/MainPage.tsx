import Nav from '../components/Nav.tsx'
import { useEffect, useState } from "react";
import { TypeAnimation } from 'react-type-animation';
import "../css/main.css";

function MainPage() {
  const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");

  // Set the background color of the nav bar to the background color of the first section (cover_section)
  useEffect (() => {
    const cover_section_element = document.getElementById("cover_section");
    if (cover_section_element) {
      setNavBgColor(getComputedStyle(cover_section_element).backgroundColor);
    }
  }, []);

  // Change the cover_section height to account for the nav bar height
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
      <section id="about_section" className="dark_section">
        <div className="about_div">
          <h1 className="header_underline">I am a header</h1>
          <p className="">hi</p>
        </div>
      </section>
    </div>
  )
}

export default MainPage
