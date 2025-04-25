import { useEffect, useState } from "react";

import "../css/index.css";

function Footer({}) {
    return (
        <div>
            <footer>
                <div className="footer_div">
                    <div>
                        <p style={{fontWeight: "bold"}}>Phishor</p>
                        <p>Want to see the source code? Click the github icon!</p>
                    </div>
                    <a href="https://github.com/MJ-Davies/Phishor" target="_blank" rel="noopener" className="github_link">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="50"
                            height="50"
                            fill="black"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.21.66-.46v-1.64c-2.79.61-3.38-1.34-3.38-1.34-.46-1.16-1.13-1.47-1.13-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.64-1.34-2.23-.25-4.57-1.11-4.57-4.94 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.61 9.61 0 0 1 12 6.8c.85.004 1.71.11 2.51.32 1.9-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.69 1.03 1.58 1.03 2.67 0 3.85-2.35 4.69-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.16.56.67.46A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z"/>
                        </svg>
                    </a>
                </div>  
            </footer>
        </div>
    )
}
  
  export default Footer