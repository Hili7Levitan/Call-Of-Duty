import app from './app.js';
import { connectToDB } from './connections.js';

function loaders() {
  try {
    connectToDB();
    app.listen({ port: process.env.PORT || 3000 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

loaders();
