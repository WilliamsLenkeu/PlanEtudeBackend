import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model';

dotenv.config();

async function updateWilliams() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI non trouvé dans le fichier .env');
    }

    console.log('⏳ Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté.');

    const themeKeys = [
      "lavender-dream",
      "mint-fresh",
      "peach-sorbet",
      "hello-kitty-world"
    ];

    console.log('⏳ Mise à jour de l\'utilisateur Williams...');
    
    const result = await User.updateOne(
      { email: "williams25prince@gmail.com" },
      { 
        $set: { 
          "preferences.unlockedThemes": themeKeys,
          "preferences.currentTheme": "lavender-dream"
        } 
      }
    );

    if (result.matchedCount === 0) {
      console.log('❌ Utilisateur non trouvé.');
    } else {
      console.log('✨ Williams a maintenant tous les thèmes !');
      console.log(`Documents modifiés : ${result.modifiedCount}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
}

updateWilliams();
