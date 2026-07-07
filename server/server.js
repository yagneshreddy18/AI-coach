import app from './app.js';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`\n🚀 PlacementPilot Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`   API: http://localhost:${env.PORT}/api/health\n`);
  });
};

startServer();
