"use client";
import {
  Bodies,
  Body,
  Composite,
  Constraint,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";
import React, { useEffect, useRef, useState } from "react";

const BodyConstrains: React.FC = () => {
  const engineRef = useRef(Engine.create());
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef(Runner.create());
  const [selectedBodies, setSelectedBodies] = useState<Body[]>([]); // Track selected bodies

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
    console.log(selectedBodies); // Listen for mouse clicks
    Events.on(mouseConstraint, "", (event) => {
      const { mouse } = event.source;
      const clickedBodies = Composite.allBodies(engine.world).filter((body) => {
        return (
          body !== ground &&
          mouse.position.x > body.bounds.min.x &&
          mouse.position.x < body.bounds.max.x &&
          mouse.position.y > body.bounds.min.y &&
          mouse.position.y < body.bounds.max.y
        );
      });
    //   console.log(mouse.position, clickedBodies);
      if (clickedBodies.length > 0) {
        const clickedBody = clickedBodies[0];
        setSelectedBodies((prev) => {
          if (prev.length === 0) {
            return [clickedBody]; // Add the first body
          } else if (prev.length === 1 && prev[0] !== clickedBody) {
            // Join the two bodies with a spring
            const spring = Constraint.create({
              bodyA: prev[0],
              bodyB: clickedBody,
              pointA: { x: Math.sqrt(prev[0].area) / 2, y: 0 },
              length: 100,
              stiffness: 0.05,
              render: {
                visible: true,
                lineWidth: 2,
                strokeStyle: "blue",
                type:"spring"
              },
            });
            World.add(engine.world, spring);

            return []; // Reset selection after joining
          } else {
            return []; // Reset if clicking the same body or already joined
          }
        });
      }
    });

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

export default BodyConstrains;
