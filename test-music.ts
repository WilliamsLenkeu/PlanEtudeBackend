import { fetchLofiTracksFromJamendo } from './src/services/lofiService';

async function testMusicFetch() {
    console.log('🚀 Démarrage du test de récupération de musique...');
    try {
        const tracks = await fetchLofiTracksFromJamendo(5);
        
        if (tracks.length === 0) {
            console.log('⚠️ Aucune musique récupérée. Vérifiez votre connexion ou le Client ID Jamendo.');
            return;
        }

        console.log(`✅ Succès ! ${tracks.length} pistes récupérées :`);
        tracks.forEach((track, index) => {
            console.log(`\n--- Piste ${index + 1} ---`);
            console.log(`Titre    : ${track.title}`);
            console.log(`Artiste  : ${track.artist}`);
            console.log(`URL      : ${track.url}`);
            console.log(`ID       : ${track.id}`);
        });

    } catch (error) {
        console.error('❌ Erreur lors du test :', error);
    }
}

testMusicFetch();
