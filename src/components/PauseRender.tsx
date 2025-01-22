'use client'
import { useEffect, useRef } from 'react';
import * as Matter from 'matter-js';

const PauseRenderingExample = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef(Matter.Engine.create());
  const renderRef = useRef<Matter.Render | null>(null);
  const isRendering = useRef(true);

  useEffect(() => {
    const engine = engineRef.current;

    // Create the renderer
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    renderRef.current = render;

    // Add bodies to the world
    const ground = Matter.Bodies.rectangle(400, 590, 810, 20, { isStatic: true,label:"Circle Body" });
    const ball = Matter.Bodies.circle(400, 100, 40, { restitution: 0.8 });
    Matter.World.add(engine.world, [ground, ball]);

    // Function to check if all bodies are at rest
    const areAllBodiesAtRest = () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      return bodies.every((body) => body.isStatic || body.isSleeping);
    };

    // Monitor engine updates and stop rendering if all objects are at rest
    const monitor = () => {
      if (isRendering.current && areAllBodiesAtRest()) {
        console.log('All bodies are at rest. Stopping rendering.');
        Matter.Render.stop(render); // Stop rendering
        isRendering.current = false;
      }
    };

    Matter.Events.on(engine, 'afterUpdate', monitor);

    // Start the engine and rendering
    Matter.Runner.run(engine);
    Matter.Render.run(render); // Ensure the render loop starts initially

    // Restart rendering on click
    const handleRestart = () => {
      if (!isRendering.current) {
        console.log('Restarting rendering.');
        Matter.Render.run(render); // Restart rendering
        isRendering.current = true;

        // Wake up objects by applying a force
        const ball = engine.world.bodies.find((b) => b.label === 'Circle Body');
        if (ball) {
          Matter.Body.applyForce(ball, ball.position, { x: 0.05, y: -0.1 });
        }
      }
    };

    render.canvas.addEventListener('click', handleRestart);

    return () => {
      // Cleanup resources
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.removeEventListener('click', handleRestart);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default PauseRenderingExample;
