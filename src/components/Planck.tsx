// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import planck from "planck-js";

// const DetailedObjectDrawing = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const worldRef = useRef(planck.World({ gravity: planck.Vec2(0, -10) }));
//   const [vertices, setVertices] = useState<{ x: number; y: number }[]>([]);
//   const [drawing, setDrawing] = useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const world = worldRef.current;

//     // Create ground
//     world.createBody({
//       type: "static",
//     }).createFixture(planck.Box(400, 10, planck.Vec2(400, 590)));

//     // Physics simulation loop
//     const step = () => {
//       world.step(1 / 60);

//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Render all bodies
//       world.forEachBody((body) => {
//         body.getFixtureList().forEach((fixture) => {
//           const shape = fixture.getShape();
//           if (shape.getType() === "polygon") {
//             const vertices = shape.m_vertices;

//             ctx.beginPath();
//             vertices.forEach((v, i) => {
//               const worldPoint = body.getWorldPoint(v);
//               if (i === 0) {
//                 ctx.moveTo(worldPoint.x, canvas.height - worldPoint.y);
//               } else {
//                 ctx.lineTo(worldPoint.x, canvas.height - worldPoint.y);
//               }
//             });
//             ctx.closePath();
//             ctx.strokeStyle = "black";
//             ctx.fillStyle = "rgba(0, 123, 255, 0.5)";
//             ctx.fill();
//             ctx.stroke();
//           }
//         });
//       });

//       requestAnimationFrame(step);
//     };
//     step();

//     return () => {
//       world.clear();
//     };
//   }, []);

//   // Handle mouse down (start drawing)
//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     setVertices([{ x: offsetX, y: offsetY }]);
//     setDrawing(true);
//   };

//   // Handle mouse move (draw preview)
//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawing) return;

//     const { offsetX, offsetY } = e.nativeEvent;
//     setVertices((prev) => [...prev, { x: offsetX, y: offsetY }]);

//     renderPreviewShape();
//   };

//   // Handle mouse up (finish drawing)
//   const handleMouseUp = () => {
//     if (!drawing || vertices.length < 3) {
//       setDrawing(false);
//       setVertices([]);
//       return;
//     }

//     setDrawing(false);

//     // Create a Planck.js body from vertices
//     const world = worldRef.current;
//     const scaledVertices = vertices.map((v) => planck.Vec2(v.x, 600 - v.y));

//     const body = world.createBody({
//       type: "dynamic",
//       position: planck.Vec2(0, 0),
//     });

//     body.createFixture(planck.Polygon(scaledVertices), { density: 1 });

//     clearPreview();
//     setVertices([]);
//   };

//   // Render the preview shape on the canvas
//   const renderPreviewShape = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw the shape
//     if (vertices.length > 1) {
//       ctx.beginPath();
//       ctx.moveTo(vertices[0].x, vertices[0].y);

//       vertices.forEach((v) => {
//         ctx.lineTo(v.x, v.y);
//       });

//       ctx.closePath();
//       ctx.strokeStyle = "#007BFF";
//       ctx.lineWidth = 2;
//       ctx.stroke();
//       ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
//       ctx.fill();
//     }
//   };

//   // Clear the preview canvas
//   const clearPreview = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (ctx) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={600}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           zIndex: 1,
//           border: "1px solid black",
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       />
//       <div style={{ marginTop: 10 }}>
//         <button
//           onClick={() => {
//             clearPreview();
//             setVertices([]);
//           }}
//           style={{
//             padding: "10px 20px",
//             background: "#dc3545",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             marginRight: "10px",
//           }}
//         >
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DetailedObjectDrawing;
