"use client";

import { useEffect, useRef, useState } from "react";

export default function VantaBackground({ children, options = {} }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    const loadVanta = async () => {
      if (!window.THREE) {
        const threeScript = document.createElement("script");
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
        document.body.appendChild(threeScript);
        await new Promise((res) => (threeScript.onload = res));
      }

      if (!window.VANTA) {
        const vantaScript = document.createElement("script");
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js";
        document.body.appendChild(vantaScript);
        await new Promise((res) => (vantaScript.onload = res));
      }

      if (window.VANTA && !vantaEffect) {
        setVantaEffect(
          window.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 1000,
            minWidth: 200,
            backgroundColor: 0xffffff,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933,
            speed: 0.8,
            ...options, // allow overriding
          })
        );
      }
    };

    loadVanta();
    return () => vantaEffect && vantaEffect.destroy();
  }, [vantaEffect, options]);

  return (
    <div ref={vantaRef} style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {children}
    </div>
  );
}
