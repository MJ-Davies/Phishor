import Nav from '../components/Nav.tsx'
import Footer from '../components/Footer.tsx'
import MHistDraggable from '../components/MHistDraggable.tsx'
import { useEffect, useState } from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");

    // Set the background color of the nav bar to the background color of the first section (cover_section)
    useEffect(() => {
        const intro_section_element = document.getElementById("intro_section");
        if (intro_section_element) {
            setNavBgColor(getComputedStyle(intro_section_element).backgroundColor);
        }
    }, []);

    return (
        <div>
            <Nav bgColor={navBgColor} />
            {/* Intro section */}
            <section id="intro_section" className="dark_section">
                <div>
                    <h1 className="header_underline">Know when you're getting <span>scammed</span></h1>
                    <p>Use the form below to add message history between you and another individual. AI will give you feedback on how likely your interaction with this individual is a phishing scam.</p>
                </div>
            </section>
            {/* Message history UI section */}
            <section id="mhist_section" className="dark_section">
                <div className="mhist_form">
                    <h1>Message History</h1>
                    <form id="mhist_entry_form">
                        <select id="user" required>
                            <option value="Sender">Sender</option>
                            <option value="You">You</option>
                        </select>
                        <label htmlFor="message" className="hidden-label">Message input field</label>
                        <textarea id="message" name="message" placeholder="Message" required />
                        <MHistDraggable />
                        <button type="submit">Add entry</button>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default HomePage