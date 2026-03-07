import React, { useEffect, useState, useRef } from "react";

const NavIcon = ({ svg, isActive, onAnimationTrigger }) => {
  const [svgContent, setSvgContent] = useState("");
  const containerRef = useRef(null);
  const svgInsertedRef = useRef(false);

  // Load SVG only once
  useEffect(() => {
    fetch(`/assets/${svg}`)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error loading SVG:", err));
  }, [svg]);

  // Insert SVG into DOM only once
  useEffect(() => {
    if (containerRef.current && svgContent && !svgInsertedRef.current) {
      containerRef.current.innerHTML = svgContent;
      svgInsertedRef.current = true;
      console.log(`SVG inserted for ${svg}`);
    }
  }, [svgContent, svg]);

  // Manage selected state for active icons
  useEffect(() => {
    if (containerRef.current && svgInsertedRef.current) {
      const svgElement = containerRef.current.querySelector("svg");
      if (svgElement) {
        console.log(`NavIcon ${svg}: isActive=${isActive}`);
        if (isActive) {
          // Keep selected class for active icons
          svgElement.classList.add("selected");
          console.log(`Added 'selected' class to ${svg}`);
        } else {
          // Remove selected class for inactive icons
          svgElement.classList.remove("selected");
          console.log(`Removed 'selected' class from ${svg}`);
        }
      }
    }
  }, [isActive, svg]);

  // Handle click to trigger animation
  const handleClick = () => {
    if (containerRef.current) {
      const svgElement = containerRef.current.querySelector("svg");
      if (svgElement) {
        console.log(`Clicked ${svg}`);

        // Add selected class to trigger animation
        svgElement.classList.add("selected");
        console.log(`Animation triggered for ${svg}`);

        // Trigger navigation immediately
        if (onAnimationTrigger) {
          onAnimationTrigger();
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-12 h-12"
      aria-hidden="true"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default React.memo(NavIcon);
