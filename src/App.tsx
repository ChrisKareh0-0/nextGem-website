import { useEffect, useRef, useState } from "react";
import { DotScreenShader } from "@/components/ui/dot-shader-background";

export function App() {
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Always standing by, whenever the moment calls.";

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");

      if (imageRef.current) {
        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 0.8,
        });

        gsap.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.3,
        });
      }

      // Typewrite animation for the text
      if (textRef.current) {
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < fullText.length) {
            setDisplayedText(fullText.slice(0, i + 1));
            i++;
          } else {
            clearInterval(typeInterval);
            // Optional: add a final animation if desired
          }
        }, 50); // Adjust speed here

        return () => clearInterval(typeInterval);
      }
    };

    loadGSAP();
  }, []);

  return (
    <>
      {/* Background shader */}
      <DotScreenShader />

      {/* Text overlay */}
      <div
        className="image23"
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img
          ref={imageRef}
          src="/images/nextgem-logo.png"
          alt="NEXT GEM"
          // Make the logo much smaller and non-interactive.
          // pointer-events-none prevents any mouse/touch interactions. draggable=false
          // prevents dragging. role+aria-hidden make it non-interactive for accessibility.
          className="pointer-events-none w-48 sm:w-64 md:w-80 lg:w-96"
          draggable={false}
          role="presentation"
          aria-hidden="true"
          tabIndex={-1}
          onError={(e) => {
            // If PNG fails to load, fall back to the SVG placeholder once.
            const target = e.currentTarget as HTMLImageElement
            if (!target.dataset.fallback) {
              target.dataset.fallback = '1'
              target.src = '/images/next-gem.svg'
            }
          }}
          // Use absolute centering so it's precisely centered regardless of any layout quirks
          // Also set an explicit width so it will be consistently small regardless of Tailwind processing.
          style={{ height: 'auto', marginBottom: '0px', color: 'white' }}
        />
        <p
          ref={textRef}
          className="text-center font-mono font-bold text-lg"
          style={{
            fontFamily: "'Courier New', monospace",
            whiteSpace: 'nowrap',
            color: 'white',
          }}
        >
          {displayedText}
          <span className="blink font-bold">|</span> {/* Cursor */}
        </p>
      </div>
    </>
  );
}

export default App;
