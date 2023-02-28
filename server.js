import app from './app.js';
import { connectToDB } from './connections.js';

function loaders() {
  connectToDB();
  app.listen({ port: process.env.PORT || 3000 });
}

loaders();
