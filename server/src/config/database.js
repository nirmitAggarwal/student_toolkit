import mongoose from 'mongoose';

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/student-toolkit';
  mongoose.set('strictQuery', false);
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDatabase;
