"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Vertices,
  Events,
  Mouse,
  MouseConstraint,
  // Contact,
  // Vertex,
} from "matter-js";
import simplify from "simplify-js";

const DetailedObjectDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef(Engine.create());
  const [vertices, setVertices] = useState<{ x: number; y: number }[]>([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const engine = engineRef.current;

    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: true,
      },
    });

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

    //  // Create two bodies
    //  const boxA = Bodies.rectangle(400, 200, 80, 80);
    //  const boxB = Bodies.rectangle(400, 300, 80, 80);

    //  World.add(engine.world, [boxA, boxB]);

    //  // Create a custom contact
    //  const vertex = { x: 400, y: 250 }; // Define the contact point
    //  const customContact = Contact.create(vertex);
    //  console.log('Custom Contact:', customContact);
    const ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });
    World.add(engine.world, [ground]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // Handle mouse down (start drawing)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(e)
    setVertices([{ x: offsetX, y: offsetY }]);
    setDrawing(true);
  };

  // Handle mouse move (draw preview)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setVertices((prev) => [...prev, { x: offsetX, y: offsetY }]);
    // Draw the preview on the canvas
    renderPreviewShape();
  };

  // Handle mouse up (finish drawing)
  const handleMouseUp = () => {
    if (!drawing || vertices.length < 3) {
      setDrawing(false);
      setVertices([]);
      return;
    }

    setDrawing(false);
    const tolerance = 1.5; // Tweak this value for desired simplification
    const highPrecision = false;

    const simplifiedVertices = simplify(vertices, tolerance, highPrecision);
    const sortedVertice = Vertices.clockwiseSort(simplifiedVertices);
    // Create a Matter.js body from vertices
    const body = Bodies.fromVertices(
      0,
      0,
      [sortedVertice],

      {
        render: {
          fillStyle: "#007BFF",
          strokeStyle: "black",
          lineWidth: 2,
        },
      },
      false
    );
    console.log(body);
    if (body) {
      // Center the body based on the average position of vertices
      const centerX =
        vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
      const centerY =
        vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

      Body.setPosition(body, { x: centerX, y: centerY });
      World.add(engineRef.current.world, body);
    }

    // Clear the preview
    clearPreview();
    setVertices([]);
  };

  // Render the preview shape on the canvas
  const renderPreviewShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the shape
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

  // Clear the preview canvas
  const clearPreview = () => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    World.clear(engine.world, true); // Clear the physics world

  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          border: "1px solid black",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            clearPreview();
            setVertices([]);
          }}
          style={{
            padding: "10px 20px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DetailedObjectDrawing;
