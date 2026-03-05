import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessCheckmark = ({ onComplete }) => {
  const navigate = useNavigate();
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    // Load the SVG content
    fetch("/assets/checkmark.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error loading checkmark SVG:", err));

    // Navigate to expenses page after animation completes (2.5s animation duration)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate("/expenses");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-900">
      <div
        className="w-48 h-48"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

export default SuccessCheckmark;
