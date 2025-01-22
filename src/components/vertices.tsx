"use client";

import React, { useEffect, useRef, useState } from "react";
// import { EngineConfig, RendererConfig } from "@/types/PhysicsTypes";
import {
  Bodies,
  Body,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";

const DrawAndConvert: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const [drawing, setDrawing] = useState<boolean>(false);
  const [vertices, setVertices] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const engine = engineRef.current!;
    const runner = runnerRef.current!;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#f4f4f4",
        // pixelRatio: window.devicePixelRatio,
        // background: "#14151f",
        pixelRatio: 2,
        // showCollisions:true,
        // showPerformance:true,
        // showVelocity:true,
        // wireframeBackground:"#14151f",
        // hasBounds:true,
      },
    });

    
    // FPS Control
    let renderCount = 0;
    let fps = 30; // Target FPS
    const interval = 1000 / fps;
    let lastTime = 0;
    
    const throttledRenderLoop = (time:number) => {
      if (time - lastTime >= interval) {
        Render.world(render);
        renderCount++; // Count each render call
        // console.log("render:",renderCount)
        lastTime = time;
      }
      requestAnimationFrame(throttledRenderLoop);
    };
    // Log the render calls per second
    setInterval(() => {
      console.log("Render calls in the last second:", renderCount);
      renderCount = 0; // Reset counter every second
    }, 1000);
    
    requestAnimationFrame(throttledRenderLoop);


    const ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });
    const box = Bodies.rectangle(400, 200, 80, 80, {
      render: {
        visible: true,
      },
    });

    interface vertice {
      x: number;
      y: number;
    }
    [];
    // Define vertices for a concave shape
    const vertices: vertice[] = [
      { x: 0, y: 67 },
      { x: 100, y: 400 },
      { x: 80, y: 50 },
      { x: 10, y: 150 },
      { x: 50, y: 100 },
      { x: 0, y: 20 },
    ];

    // Create a concave body using Matter.Bodies.fromVertices
    const concavePolygon = Bodies.fromVertices(400, 200, vertices, {
      render: {
        fillStyle: "blue",
        strokeStyle: "black",
        lineWidth: 2,
      },
    });

    const trapezoid = Bodies.trapezoid(259, 300, 40, 40, 1);
    const polygon = Bodies.polygon(300, 200, 7, 40);

    World.add(engine.world, [ground, concavePolygon, box, trapezoid, polygon]);

    // Add mouse control
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

    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      //   cancelAnimationFrame(animationFrame);
      Runner.stop(runner);
      Render.stop(render);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setVertices([{ x: offsetX, y: offsetY }]);
  };
  console.log(vertices);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
  
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect(); // Get canvas bounds for proper scaling
    const x = e.clientX - rect.left; // Map mouse position to canvas coordinates
    const y = e.clientY - rect.top;
  
    setVertices((prev) => [...prev, { x, y }]);
    renderPreviewShape(); // Render the preview dynamically
  };

  const handleMouseUp = () => {
    if (!drawing || vertices.length < 3) return; // Ensure at least 3 points for a shape
  
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    // Create a Matter.js body from the drawn vertices
    const body = Bodies.fromVertices(
      0,
      0,
      [vertices],
      {
        render: {
          fillStyle: "#007BFF",
          strokeStyle: "black",
          lineWidth: 2,
        },
      },
      true
    );
  
    if (body) {
      // Center the body around its average position
      const centerX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
      const centerY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;
  
      Body.setPosition(body, { x: centerX, y: centerY });
  
      // Add the body to the physics world
      World.add(engineRef.current!.world, body);
    }
  
    clearPreview(); // Clear the preview from the canvas
    setVertices([]); // Reset vertices for the next drawing
  };

  const renderPreviewShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the preview canvas
  
    if (vertices.length > 1) {
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
  
      vertices.forEach((v) => {
        ctx.lineTo(v.x, v.y);
      });
  
      ctx.closePath();
      ctx.strokeStyle = "#007BFF";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
      ctx.fill();
    }
  };
  
  const clearPreview = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    // Clear the Matter.js world (except for static objects like ground)
    const world = engineRef.current.world;
    World.clear(world, false);

    // Clear the canvas
    clearPreview();
  };

  const toggleDrawing = () => {
    setDrawing((prev) => !prev);
  };

  return (
    <div className="relative" style={{ position: "relative" }}>
      <div ref={sceneRef} style={{ position: "relative", zIndex: 0 }}></div>
      <canvas
        ref={canvasRef}
        style={{
          display: drawing ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: drawing ? "auto" : "none",
        }}
        width={800}
        height={600}
        
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ marginTop: 10 }}>
        <button
          onClick={toggleDrawing}
          style={{
            padding: "10px 20px",
            background: drawing ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {drawing ? "Stop Drawing" : "Start Drawing"}
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: "10px 20px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default DrawAndConvert;

