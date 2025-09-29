import Nav from '../components/Nav.tsx'
import Footer from '../components/Footer.tsx'
import MHistForm from '../components/MHistForm.tsx'
import { useEffect, useState } from "react";
import "../css/home.css";

function HomePage() {
    const [navBgColor, setNavBgColor] = useState("var(--color-primaryBgColorLight)");
    const [feedback, setFeedback] = useState([]);

    // Purpose: Set the background color of the nav bar to the background color of the first section (cover_section)
    // Parameters: None
    // Returns: None
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
                    <p>Click and drag to change the order of messages.</p>
                </div>
            </section>
            {/* Message history UI section */}
            <section id="mhist_section" className="dark_section">
                <div className="mhist_form">
                    <h1>Message History</h1>
                    <MHistForm />
                </div>
            </section>
            {/* Feedback section */}
            <section id="feedback_section" className="light_section">
                <div>
                    <h1>Feedback</h1>
                    {feedback.length === 0 ? (
                        <p>
                        No feedback available yet.
                        </p>
                    ) : (
                        <p>
                        {feedback}
                        </p>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default HomePage