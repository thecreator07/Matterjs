"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js";

const PauseAndFastForward: React.FC = () => {
  const engineRef = useRef(Engine.create());
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef(Runner.create());
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const engine = engineRef.current;

    // Create a renderer
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    renderRef.current = render;
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    // Custom drawing when interacting with mouse
    const context = render.canvas.getContext("2d")!;
    Events.on(mouseConstraint, "mousedown", (event) => {
      const { mouse } = event.source;
      context.fillStyle = "rgba(255, 0, 0, 0.5)";
      context.beginPath();
      context.arc(mouse.position.x, mouse.position.y, 10, 0, Math.PI * 2);
      context.fill();
    });
    // Add objects to the world
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
    World.add(engine.world, [boxA, ground]);

    // Run the engine and renderer
    const runner = runnerRef.current;
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup on unmount
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // Pause the simulation
  const handlePause = () => {
    if (!renderRef.current) return;
    Render.stop(renderRef.current); // Stop rendering
    Runner.stop(runnerRef.current!); // Stop the runner
    setIsPaused(true);
  };

  // Resume the simulation
  const handleResume = () => {
    if (!renderRef.current) return;
    Render.run(renderRef.current); // Restart rendering
    Runner.run(runnerRef.current!, engineRef.current); // Restart the runner
    setIsPaused(false);
  };

  // Fast forward the simulation
  const handleFastForward = () => {
    if (isPaused) return; // Ensure fast-forward works when paused

    const engine = engineRef.current;
    const timeStep = 1000 / 60; // Fixed time step (16.67ms for 60 FPS)

    // Advance the physics simulation by 2 seconds
    for (let i = 0; i < 120; i++) {
      Engine.update(engine, timeStep); // Update the engine manually
    }
  };

  return (
    <div>
      <button
        onClick={isPaused ? handleResume : handlePause}
        style={{
          padding: "10px 20px",
          background: isPaused ? "#28a745" : "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button
        onClick={handleFastForward}
        // disabled={!isPaused}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginLeft: "10px",
          opacity: isPaused ? 1 : 0.6,
        }}
      >
        Fast Forward
      </button>
    </div>
  );
};

export default PauseAndFastForward;
