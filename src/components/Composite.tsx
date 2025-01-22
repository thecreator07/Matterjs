"use client";
import {
  Bodies,
  Composite,
  Constraint,
  Engine,
  // Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";
import React, { useEffect, useRef, useState } from "react";

const CompositeExample: React.FC = () => {
  const engineRef = useRef(Engine.create());
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef(Runner.create());
  // const [selectedBodies, setSelectedBodies] = useState<any[]>([]); // Track selected bodies

  useEffect(() => {
    const engine = engineRef.current;
    const runner = runnerRef.current;
    const render = Render.create({
      element: document.body,
      engine: engineRef.current,
      options: {
        width: 800,
        height: 600,
        wireframes: true,
      },
    });

    renderRef.current = render;

    // Create ground and boxes
    const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });
    const boxA = Bodies.rectangle(300, 200, 80, 80);
    const boxB = Bodies.rectangle(500, 200, 80, 80);
    const boxC = Bodies.rectangle(400, 300, 80, 80);

    World.add(engine.world, [ground, boxA, boxB, boxC]);

    // Mouse and mouse constraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: {
          visible: true,
        },
      },
    });

    World.add(engine.world, mouseConstraint);
    console.log(World.allBodies); // Listen for mouse clicks

    // Create a composite for the bridge
    const bridge = Composite.create({ label: "Bridge" });

    // Create planks and connect them with constraints
    const plankCount = 5;
    const planks = [];
    for (let i = 0; i < plankCount; i++) {
      const plank = Bodies.rectangle(200 + i * 60, 300, 60, 20);
      planks.push(plank);
      Composite.add(bridge, plank);

      // Connect each plank to the next with a constraint
      if (i > 0) {
        const constraint = Constraint.create({
          bodyA: planks[i - 1],
          bodyB: plank,
          stiffness: 0.5,
        });
        Composite.add(bridge, constraint);
      }
    }

    // const interval = setInterval(() => {
    //   // Rotate the composite
    //   Composite.rotate(bridge, Math.PI / 4, { x: 250, y: 250 }); // Rotates 45° around the point (250, 250)
    //   // Scale the bridge
    //   Composite.scale(bridge, 1.5, 1.5, { x: 250, y: 250 }); // Scales by 1.5x around the point (250, 250)
    //   // Translate the bridge
    //   Composite.translate(bridge, { x: 20, y: 0 }); // Moves the composite 100 units to the right and 50 units down
    // },1000);

    // setTimeout(() => {
    //    clearInterval(interval)
    //   Composite.clear(bridge, true); // Clears the composite, including all its bodies and constraints
    //   World.remove(engine.world, bridge); // Removes the composite from the world
    // }, 5000);
   
    // Add the bridge to the world
    World.add(engine.world, bridge);



    // Run the engine and renderer
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      Engine.clear(engine);
    };
  }, []);

  return null;
};

export default CompositeExample;
