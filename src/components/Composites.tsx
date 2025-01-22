"use client";
import {
  Bodies,
  Composite,
  Composites,
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

const CompositesExample: React.FC = () => {
  const engineRef = useRef(Engine.create());
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef(Runner.create());

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
    const boxB = Bodies.rectangle(400, 200, 80, 80);
    const boxC = Bodies.rectangle(500, 300, 80, 80);

    World.add(engine.world, [ground]);

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
    render.mouse = mouse;

    //create stack of objects
    const chainBodies = Composites.stack(
      100,
      50,
      10,
      1,
      40,
      40,
      (x: any, y: any) => {
        console.log(x, y);
        return Bodies.rectangle(x, y, 50, 50, {
          render: {
            fillStyle: "#ffaa00",
          },
        });
      }
    );
    
    // create a chain of stack bodies
    const chain = Composites.chain(chainBodies, 0.5, 0, -0.5, 0, {
      stiffness: 0.01,
      length: 5,
      render: {
        strokeStyle: "#ffffff",
      },
    });

    // add first body of chain to static point
    Composite.add(
      chain,
      Constraint.create({
        bodyB: chain.bodies[0],
        pointA: { x: 100, y: 0 },
        pointB: {
          x: -(
            (chain.bodies[0].bounds.max.x - chain.bodies[0].bounds.min.x) /
            4
          ),
          y: 0,
        },
        // point: { x: 400, y: 50 },
        stiffness: 0.8,
      })
    );
    // console.log(chain)
    World.add(engine.world, chain);

    // simple composite chain
    // const compositeBox = Composite.create({ label: "composite box" });
    // // Add bodies to the composite
    // Composite.add(compositeBox, [boxA, boxB, boxC]);
    // const compositeChain = Composites.chain(compositeBox, 0.5, 0, -0.5, 0, {
    //   stiffness: 0.01,
    //   length: 10,
    //   render: {},
    // });
    // World.add(engine.world, compositeChain);

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

export default CompositesExample;
