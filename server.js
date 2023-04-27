import app from './app.js';
import { connectToDB } from './connections.js';

async function init() {
  try {
    await connectToDB();
    app.listen({ port: process.env.PORT || 3000 });
  } catch (error) {
    app.log.error(error);
  }
}

init();
