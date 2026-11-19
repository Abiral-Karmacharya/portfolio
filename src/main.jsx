import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// devtools greeting — for the people who check
console.log(
  "%c> you checked the console. correct instinct.",
  "color:#34d399;font-family:monospace;font-size:14px"
);
console.log(
  "%c> the page source hides a base64 string. the terminal accepts flags.\n> harder challenge: type `wget challenge.pdf` in the terminal.\n> github: https://github.com/Abiral-Karmacharya",
  "color:#64778a;font-family:monospace"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
