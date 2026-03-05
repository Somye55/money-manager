import React, { useEffect, useState, useRef } from "react";

const NavIcon = ({ svg, isActive, label }) => {
  const [svgContent, setSvgContent] = useState("");
  const containerRef = useRef(null);

  // Load SVG only once
  useEffect(() => {
    fetch(`/assets/${svg}`)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error loading SVG:", err));
  }, [svg]);

  // Toggle the 'selected' class on the SVG element when isActive changes
  useEffect(() => {
    if (containerRef.current && svgContent) {
      const svgElement = containerRef.current.querySelector("svg");
      if (svgElement) {
        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
          if (isActive) {
            svgElement.classList.add("selected");
          } else {
            svgElement.classList.remove("selected");
          }
        });
      }
    }
  }, [isActive, svgContent]);

  return (
    <div
      ref={containerRef}
      className="w-8 h-8"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      aria-hidden="true"
    />
  );
};

export default React.memo(NavIcon);
