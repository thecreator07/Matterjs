"use client";
import { Render, Engine, World, Bodies, Runner } from "matter-js";
import GIF from "gif.js";
import { useEffect, useRef } from "react";

const CreateGifWithGifJs = () => {
  const gifRef = useRef<GIF | null>(null); // Reference for GIF.js instance
  const renderRef = useRef<Render | null>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const engine = Engine.create();
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    engineRef.current = engine;
    renderRef.current = render;

    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
    World.add(engine.world, [boxA, ground]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Initialize GIF.js instance
    gifRef.current = new GIF({
      workers: 2,
      height: 200,
      width: 100,
      quality: 10,
    });

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  const handleGenerateGif = () => {
    if (!renderRef.current || !gifRef.current) return;

    const render = renderRef.current;
    const gif = gifRef.current;

    // Capture frames every 33ms (~30 FPS)
    const interval = setInterval(() => {
      gif.addFrame(render.canvas, { copy: true });
    }, 33);

    // Stop capturing after 5 seconds and download the GIF
    setTimeout(() => {
      clearInterval(interval);
      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);

        // Trigger GIF download
        const link = document.createElement("a");
        link.href = url;
        link.download = "animation.gif";
        link.click();
      });

      gif.render();
    }, 5000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleGenerateGif}
        style={{
          padding: "10px 20px",
          background: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Generate & Download GIF
      </button>
    </div>
  );
};

export default CreateGifWithGifJs;
