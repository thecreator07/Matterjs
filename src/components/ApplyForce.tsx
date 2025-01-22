"use client";

import React, { useEffect } from "react";
import { Engine, Render, Runner, World, Bodies, Body } from "matter-js";

const ApplyForceExample: React.FC = () => {
  useEffect(() => {
    // Create engine and renderer
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

    // Create a body
    const box = Bodies.rectangle(400, 300, 80, 80, {
      render: {
        fillStyle: "blue",
      },
    });

    const ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });

    // Add bodies to the world
    World.add(engine.world, [box, ground]);

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Apply a force on the body after a short delay
    // setTimeout(() => {
    //   const forceMagnitude = 0.02; // Adjust the magnitude of the force
    //   const force = { x: forceMagnitude, y: -forceMagnitude }; // Force vector
    //   const position = { x: box.position.x, y: box.position.y - 40 }; // Force origin

    //   // Apply the force
    //   Body.applyForce(box, position, force);

    //   console.log('Force applied to box:', force, 'at position:', position);
    // }, 1000); // Apply force after 1 second
    const applyContinuousForce = () => {
      const interval = setInterval(() => {
        const forceMagnitude = 0.002;
        const force = { x: forceMagnitude, y: 0 };
        Body.applyForce(box, box.position, force);
      }, 16.67); // Apply force every frame (~60 FPS)
      setTimeout(() => clearInterval(interval), 10000); // Stop after 2 seconds
    };

    applyContinuousForce();
    // Cleanup on unmount
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return null;
};

export default ApplyForceExample;
