import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://AnabelSerna:mongocontra@entregafinal.j3f1t.mongodb.net/AnabelSerna?retryWrites=true&w=majority');
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;