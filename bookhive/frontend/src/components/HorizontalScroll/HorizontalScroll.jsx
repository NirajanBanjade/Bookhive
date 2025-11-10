import React, { useRef, useEffect } from "react";
import "./HorizontalScroll.css";

const HorizontalScroll = ({ children, speed = 0.5, autoScroll = true }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!autoScroll) return;

    const scroll = () => {
      const container = scrollRef.current;
      if (!container) return;

      // Auto-scroll with infinite loop effect
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += speed;
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoScroll, speed]);

  // Duplicate children for seamless infinite scroll
  const duplicatedChildren = [
    ...React.Children.toArray(children),
    ...React.Children.toArray(children),
  ];

  return (
    <div className="horizontal-scroll-container">
      <div className="horizontal-scroll-wrapper" ref={scrollRef}>
        {duplicatedChildren}
      </div>
    </div>
  );
};

export default HorizontalScroll;
