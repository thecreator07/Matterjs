// "use client";

// import React, { useEffect, useRef } from "react";
// // import { EngineConfig, RendererConfig } from "@/types/PhysicsTypes";
// import {
//   Bodies,
//   Engine,
//   Events,
//   Mouse,
//   MouseConstraint,
//   Render,
//   Runner,
//   // Vertices,
//   World,
// } from "matter-js";

// const PhysicsCanvas: React.FC = () => {
//   const sceneRef = useRef<HTMLDivElement | null>(null);
//   const engineRef = useRef(Engine.create());
//   const runnerRef = useRef(Runner.create());
//   useEffect(() => {
//     const engine = engineRef.current!;
//     const runner = runnerRef.current!;

//     const render = Render.create({
//       element: sceneRef.current!,
//       engine: engine,
//       options: {
//         width: window.innerWidth,
//         height: window.innerWidth,
//         wireframes: false,

//         // background: "#14151f",
//         // pixelRatio:2,
//         // showCollisions:true,
//         // showPerformance:true,
//         // showVelocity:true,
//         // wireframeBackground:"#14151f",
//         // hasBounds:true,
//       },
//     });

//     const ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });
//     const box = Bodies.rectangle(400, 200, 80, 80, {
//       render: {
//         visible: true,
//       },
//     });


// interface vertice{
// x:number,y:number
// }[]
// // Define vertices for a concave shape
//     const vertices:vertice[] = [
//       { x: 0, y: 67 },
//       { x: 100, y: 400 },
//       { x: 80, y: 50 },
//       { x: 10, y: 150 },
//       { x: 50, y: 100 },
//       { x: 0, y: 20 },
//     ];

//     // Create a concave body using Matter.Bodies.fromVertices
//     const concavePolygon = Bodies.fromVertices(400, 200, vertices, {
//       render: {
//         fillStyle: 'blue',
//         strokeStyle: 'black',
//         lineWidth: 2,
//       },
//     });

//     const trapezoid = Bodies.trapezoid(259, 300, 40, 40, 1);
//     const polygon = Bodies.polygon(300, 200, 7, 40);

//     World.add(engine.world, [ground,concavePolygon, box, trapezoid, polygon]);

//     // Add mouse control
//     const mouse = Mouse.create(render.canvas);
//     const mouseConstraint = MouseConstraint.create(engine, {
//       mouse: mouse,
//       constraint: {
//         stiffness: 0.2,
//         render: {
//           visible: true,
//         },
//       },
//     });

//     World.add(engine.world, mouseConstraint);

//     // Custom drawing when interacting with mouse
//     const context = render.canvas.getContext("2d")!;
//     Events.on(mouseConstraint, "mousedown", (event) => {
//       const { mouse } = event.source;
//       context.fillStyle = "rgba(255, 0, 0, 0.5)";
//       context.beginPath();
//       context.arc(mouse.position.x, mouse.position.y, 10, 0, Math.PI * 2);
//       context.fill();
//     });
//     Runner.run(runner, engine);
//     Render.run(render);

//     return () => {
//       //   cancelAnimationFrame(animationFrame);
//       Runner.stop(runner);
//       Render.stop(render);
//       render.canvas.remove();
//       render.textures = {};
//     };
//   }, []);
//   return <div ref={sceneRef}></div>;
// };

// export default PhysicsCanvas;
