import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model';
import Planning from './models/Planning.model';
import Progress from './models/Progress.model';
import ChatHistory from './models/ChatHistory.model';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('--- Démarrage des tests API ---');

  try {
    // 0. Vider la base de données avant les tests
    console.log('Nettoyage de la base de données...');
    await mongoose.connect(process.env.MONGODB_URI!);
    await User.deleteMany({});
    await Planning.deleteMany({});
    await Progress.deleteMany({});
    await ChatHistory.deleteMany({});
    console.log('✅ Base de données vidée.');
    await mongoose.connection.close();

    // 1. Test de la route de base
    const health = await fetch('http://localhost:5000/');
    console.log('Base URL:', health.status === 200 ? '✅ OK' : '❌ Erreur');

    // 2. Test Register
    const userData = {
      name: 'Thomas',
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      gender: 'M'
    };
    
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const regJson = await regRes.json();
    console.log('Auth Register:', regRes.ok ? '✅ Succès' : `❌ Échec: ${regJson.message}`);

    if (regRes.ok) {
      const token = regJson.token;
      
      // 3. Test Get Profile
      const profRes = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profJson = await profRes.json();
      console.log('Get Profile:', profRes.ok ? '✅ Succès' : '❌ Échec');
      if (profRes.ok) {
        console.log(`Utilisateur: ${profJson.name}, Genre: ${profJson.gender}`);
      }

      // 4. Test Chat (Gemini) - Génération de Planning
      console.log('Test Chat IA (PixelCoach) avec génération de planning...');
      const chatRes = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: 'PixelCoach, crée-moi un planning de révision pour demain. Je veux bosser les maths de 9h à 11h et le TypeScript de 14h à 16h.' })
      });
      const chatJson = await chatRes.json();
      console.log('Chat IA:', chatRes.ok ? '✅ Succès' : `❌ Échec: ${chatJson.message}`);
      if (chatRes.ok) {
        console.log('Réponse IA:', chatJson.response);
        console.log('Planning créé automatiquement:', chatJson.planningCreated ? '✅ OUI' : '❌ NON');
        if (chatJson.planningCreated) {
          console.log('Détails du planning:', JSON.stringify(chatJson.planning, null, 2));
        }
      }

      // 5. Test CRUD Planning
      const planRes = await fetch(`${API_URL}/planning`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          periode: 'jour',
          dateDebut: new Date(),
          sessions: [{
            matiere: 'TypeScript',
            debut: new Date(),
            fin: new Date(Date.now() + 3600000),
            statut: 'planifie'
          }]
        })
      });
      console.log('Create Planning:', planRes.ok ? '✅ Succès' : '❌ Échec');
    }

  } catch (error) {
    console.error('Erreur pendant les tests:', error);
  }
}

testAPI();