import Theme from './src/models/Theme.model';
import LofiTrack from './src/models/LofiTrack.model';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fetchLofiTracksFromJamendo } from './src/services/lofiService';

dotenv.config();

const themes = [
  {
    key: 'classic-pink',
    name: 'Rose Classique 🌸',
    description: 'Le thème original tout doux pour tes sessions d\'étude.',
    priceXP: 0,
    isPremium: false,
    config: {
      primaryColor: '#FFB6C1',
      secondaryColor: '#FFD1DC',
      backgroundColor: '#FFF0F5',
      accentColor: '#FF69B4',
      textColor: '#4A4A4A',
      fontFamily: "'Quicksand', sans-serif",
      borderRadius: '20px',
      cardShadow: '0 8px 15px rgba(255, 182, 193, 0.2)'
    }
  },
  {
    key: 'strawberry-milk',
    name: 'Lait Fraise 🍓',
    description: 'Un délice sucré et crémeux pour une ambiance gourmande.',
    priceXP: 500,
    isPremium: false,
    config: {
      primaryColor: '#FF8DA1',
      secondaryColor: '#FFB7C5',
      backgroundColor: '#FFF5F6',
      accentColor: '#E0115F',
      textColor: '#5D2E36',
      fontFamily: "'Fredoka', sans-serif",
      borderRadius: '25px',
      cardShadow: '0 10px 20px rgba(224, 17, 95, 0.15)'
    }
  },
  {
    key: 'lavender-dream',
    name: 'Rêve de Lavande 💜',
    description: 'Plonge dans un nuage de douceur et de calme.',
    priceXP: 1000,
    isPremium: false,
    config: {
      primaryColor: '#B19CD9',
      secondaryColor: '#E6E6FA',
      backgroundColor: '#F3E5F5',
      accentColor: '#9370DB',
      textColor: '#311B92',
      fontFamily: "'Nunito', sans-serif",
      borderRadius: '15px',
      cardShadow: '0 8px 15px rgba(147, 112, 219, 0.2)'
    }
  },
  {
    key: 'mint-fresh',
    name: 'Menthe Givrée ❄️',
    description: 'Un vent de fraîcheur pour rester concentrée au maximum.',
    priceXP: 1500,
    isPremium: false,
    config: {
      primaryColor: '#98FF98',
      secondaryColor: '#AAF0D1',
      backgroundColor: '#F0FFF0',
      accentColor: '#3EB489',
      textColor: '#1A4333',
      fontFamily: "'Montserrat', sans-serif",
      borderRadius: '30px',
      cardShadow: '0 8px 20px rgba(62, 180, 137, 0.15)'
    }
  },
  {
    key: 'peach-sorbet',
    name: 'Sorbet Pêche 🍑',
    description: 'Une explosion de vitamines et de couleurs douces.',
    priceXP: 2000,
    isPremium: false,
    config: {
      primaryColor: '#FFDAB9',
      secondaryColor: '#FFCC99',
      backgroundColor: '#FFF4E6',
      accentColor: '#FF8C00',
      textColor: '#5C3317',
      fontFamily: "'Quicksand', sans-serif",
      borderRadius: '20px',
      cardShadow: '0 8px 15px rgba(255, 140, 0, 0.15)'
    }
  },
  {
    key: 'hello-kitty-world',
    name: 'Hello Kitty World 🎀',
    description: 'L\'expérience ultime pour les fans inconditionnelles.',
    priceXP: 5000,
    isPremium: true,
    config: {
      primaryColor: '#F20089',
      secondaryColor: '#FF85A1',
      backgroundColor: '#FFFFFF',
      accentColor: '#000000',
      textColor: '#000000',
      fontFamily: "'Quicksand', sans-serif",
      borderRadius: '10px',
      cardShadow: '5px 5px 0px #FF85A1'
    }
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connecté à MongoDB pour le seeding...');

    await Theme.deleteMany({});
    await Theme.insertMany(themes);
    console.log('Thèmes ajoutés ! ✅');

    // Récupération des vraies pistes depuis Jamendo
    const realTracks = await fetchLofiTracksFromJamendo(30);
    
    if (realTracks.length > 0) {
      await LofiTrack.deleteMany({});
      await LofiTrack.insertMany(realTracks);
      console.log(`${realTracks.length} pistes Lo-Fi réelles ajoutées depuis Jamendo ! ✅`);
    } else {
      console.log('Aucune piste récupérée depuis Jamendo, conservation des anciennes données.');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
  }
};

seed();
