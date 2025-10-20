import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const { MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, MONGO_DB_NAME, MONGO_DB_PORT } = process.env;

    const uri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongodb:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`;

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error.message);
    process.exit(1);
  }
};

export default connectDB;
