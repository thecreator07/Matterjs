// 'use client'
// import { Engine, Render, Runner, World, Bodies, Contact } from 'matter-js';

// const createCustomContactExample = () => {
//   const engine = Engine.create();
//   const render = Render.create({
//     element: document.body,
//     engine: engine,
//     options: {
//       width: 800,
//       height: 600,
//       wireframes: true,
//     },
//   });

//   // Create two bodies
//   const boxA = Bodies.rectangle(400, 200, 80, 80);
//   const boxB = Bodies.rectangle(400, 300, 80, 80);

//   World.add(engine.world, [boxA, boxB]);

//   // Create a custom contact
//   const vertex = { x: 400, y: 250 }; // Define the contact point
//   const customContact = Contact.create(vertex);

//   console.log('Custom Contact:', customContact);

//   // Run the engine and renderer
//   const runner = Runner.create();
//   Runner.run(runner, engine);
//   Render.run(render);

//   return engine;
// };


// export default createCustomContactExample;
