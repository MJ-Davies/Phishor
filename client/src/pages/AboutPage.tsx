/**
 * Purpose: Represent content on the About webpage
 */
import Nav from '../components/Nav.tsx'
import Footer from '../components/Footer.tsx'
import { useRef, useEffect, useState } from "react";
import "../css/about.css";

function AboutPage() {
    const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");
    const hasRun = useRef(false);

    // Array of hex : name pairs
    const colors: { hex: string; name: string }[] = [
        { hex: "#0E1A0D", name: "Deep Forest Green" },
        { hex: "#F0F9EF", name: "Misty White" },
        { hex: "#FDFCEA", name: "Soft Vanilla" },
        { hex: "#051F04", name: "Midnight Green" },
        { hex: "#F4E0AE", name: "Sunlight Beige" },
        { hex: "#FFC5AF", name: "Peach Blossom" },
        { hex: "#A8CD88", name: "Sage Green" },
        { hex: "#264621", name: "Woodland Green" },
    ];

    // Purpose: Set the background color of the nav bar to the background color of the first section (cover_section)
    // Parameters: None
    // Returns: None
    useEffect(() => {
        const intro_section_element = document.getElementById("intro_section");
        if (intro_section_element) {
            setNavBgColor(getComputedStyle(intro_section_element).backgroundColor);
        }
    }, []);

    // Purpose: Add the branding colors to the colour grid
    // Parameters: None
    // Returns: None
    useEffect(() => {
        const color_grid_element = document.getElementById("color_grid");
    
        if (color_grid_element && !hasRun.current) {
            hasRun.current = true; // Prevent effect from running twice
            console.log("Effect ran, colorsAdded:");
            colors.forEach(color => {
                const div = document.createElement("div");
                div.className = "color_box";
                div.style.backgroundColor = color.hex;
                div.style.color = getContrastingColor(color.hex);
                div.innerText = color.name;
                color_grid_element.appendChild(div);
            });
        }
    }, []);

    // Purpose: Function to determine contrasting text color (black or white)
    // Parameters: hex(String) - The hex value of a colour in string format
    // Returns: String of #000000 (black) or #FFFFFF (white)
    function getContrastingColor(hex: string): string {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#FFFFFF"; // Use black or white text for contrast
    }

    return (
        <div>
            <Nav bgColor={navBgColor} />
            {/* About section */}
            <section id="about_section" className="light_section">
                <div className="about_div">
                    <h1 className="header_underline">Branding</h1>
                    <p>Phishor—Nature's Watchful Guardian Against Digital Deception. Like cherry blossoms signaling the arrival of spring, our AI tool detects phishing attempts before they take root. Elegant, swift, and precise—your digital security, naturally enhanced.</p>
                    <div id="color_grid" className="color_grid_div">
                        {/* Grid boxes go here */}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default AboutPage