import React, { useEffect, useState } from "react";

const StartupLogo = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    // Load the SVG content
    fetch("/assets/startup-logo-interactive.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error loading startup SVG:", err));

    // Complete animation after 5 seconds (full animation cycle)
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div
        className="w-64 h-64"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

export default StartupLogo;
