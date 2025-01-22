"use client";

import React, { useEffect, useRef } from "react";
// import { EngineConfig, RendererConfig } from "@/types/PhysicsTypes";
import { Bodies, Engine, Render, Runner, World } from "matter-js";

const PhysicsEngine: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  useEffect(() => {
    const engine = engineRef.current!;
    const runner = runnerRef.current!;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerWidth,
        wireframes: false,
        // background: "#14151f",
        // pixelRatio:2,
        // showCollisions:true,
        // showPerformance:true,
        // showVelocity:true,
        // wireframeBackground:"#14151f",
        // hasBounds:true,
      },
    });

    // Add bodies
    const ground = Bodies.rectangle(400, 590, 810, 20, {
      isStatic: true,
      render: { fillStyle: "green" },
    });
    const ball = Bodies.circle(400, 100, 40, {
      restitution: 0.8,
      render: { fillStyle: "blue" },
    });
    World.add(engine.world, [ground, ball]);

    const canvas = render.canvas;
    canvas.style.border = "2px solid red"; // Add a red border
    canvas.style.backgroundColor = "#fffff"; // Set a custom background color

    const context = canvas.getContext("2d")!;
    let animationFrame: number;

    const draw = () => {
      // Custom drawing logic
      context.save(); // Save the current canvas state
      context.fillStyle = "rgba(255, 255, 255, 0.1)"; // Transparent overlay
      context.fillRect(0, 0, render.canvas.width, render.canvas.height); // Draw the overlay

      // Draw a custom shape (e.g., a circle around the ball)
      context.beginPath();
      context.arc(ball.position.x, ball.position.y, 50, 0, Math.PI * 2);
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.stroke();
      context.restore();

      animationFrame = requestAnimationFrame(draw);
    };

    draw(); // Start the custom drawing loop

    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      Runner.stop(runner);
      Render.stop(render);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);
  return <div ref={sceneRef}></div>;
};

export default PhysicsEngine;
