import mongoose from 'mongoose';
import { config } from './env';
import User from '../models/User.model';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Création de l'utilisateur Admin par défaut si inexistant
    const adminEmail = 'admin@planetude.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      console.log('👑 Création de l\'utilisateur Admin par défaut...');
      await User.create({
        username: 'Admin',
        email: adminEmail,
        password: 'AdminPassword123!', // À changer dès la première connexion
        role: 'admin',
        studyStats: {
          totalStudyTime: 0,
          subjectMastery: []
        }
      });
      console.log('✅ Admin créé avec succès (admin@planetude.com / AdminPassword123!)');
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;