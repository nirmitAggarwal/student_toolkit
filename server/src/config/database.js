import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDatabase = async () => {
  let uri = process.env.MONGODB_URI;

  try {
    console.log('Starting in-memory MongoDB server...');
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    console.log(`In-memory MongoDB started successfully: ${uri}`);
  } catch (err) {
    console.error('Failed to start in-memory MongoDB server, falling back to env/default URI:', err);
    if (!uri) {
      uri = 'mongodb://localhost:27017/student-toolkit';
    }
  }

  mongoose.set('strictQuery', false);
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Handle cleanup
process.on('SIGTERM', async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
});

export default connectDatabase;

