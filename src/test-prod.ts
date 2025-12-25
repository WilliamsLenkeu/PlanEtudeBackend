
const PROD_URL = 'https://northern-nikkie-educ-4193118d.koyeb.app';
const API_URL = `${PROD_URL}/api`;

async function testProdAPI() {
  console.log('--- Démarrage des tests sur l\'API de PRODUCTION ---');
  console.log(`URL: ${PROD_URL}`);

  try {
    // 1. Test de la route de base (Health check)
    console.log('\n1. Test Health Check...');
    const health = await fetch(`${PROD_URL}/`);
    const healthText = await health.text();
    console.log(`Base URL status: ${health.status}`);
    console.log(`Response: ${healthText}`);
    console.log(health.status === 200 ? '✅ OK' : '❌ Erreur');

    // 2. Test Register
    console.log('\n2. Test Registration...');
    const userData = {
      name: 'Test User ' + Math.floor(Math.random() * 1000),
      email: `test_prod_${Date.now()}@example.com`,
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
      console.log('Token obtenu !');
      
      // 3. Test Get Profile
      console.log('\n3. Test Get Profile...');
      const profRes = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profJson = await profRes.json();
      console.log('Get Profile:', profRes.ok ? '✅ Succès' : '❌ Échec');
      if (profRes.ok) {
        console.log(`Utilisateur: ${profJson.name}, Genre: ${profJson.gender}`);
      }

      // 4. Test Chat (Gemini) - Génération de Planning
      console.log('\n4. Test Chat IA (PixelCoach) avec génération de planning...');
      const chatRes = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: 'Salut PixelCoach ! Organise-moi une session d\'étude pour ce soir de 18h à 20h sur l\'Intelligence Artificielle.' })
      });
      const chatJson = await chatRes.json();
      console.log('Chat IA:', chatRes.ok ? '✅ Succès' : `❌ Échec: ${chatJson.message || 'Erreur inconnue'}`);
      
      if (chatRes.ok) {
        console.log('Réponse IA (début):', chatJson.response.substring(0, 100) + '...');
        console.log('Planning créé automatiquement:', chatJson.planningCreated ? '✅ OUI' : '❌ NON');
        if (chatJson.planningCreated) {
          console.log('Détails du planning (ID):', chatJson.planning._id || 'ID non disponible');
          console.log('Nombre de sessions:', chatJson.planning.sessions?.length || 0);
        }
      }

      // 5. Test Get Plannings
      console.log('\n5. Vérification des plannings sauvegardés...');
      const listRes = await fetch(`${API_URL}/planning`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const listJson = await listRes.json();
      console.log('Liste des plannings:', listRes.ok ? `✅ Succès (${listJson.length} trouvés)` : '❌ Échec');

    } else {
        console.error('Impossible de continuer les tests sans compte.');
    }

  } catch (error) {
    console.error('Erreur pendant les tests de production:', error);
  }
}

testProdAPI();
