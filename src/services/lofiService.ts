import dotenv from 'dotenv';

dotenv.config();

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '7119fb97'; // Client ID de test public
const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0/tracks/';

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  audio: string;
  image: string;
  album_name: string;
}

// Cache simple en mémoire pour éviter de spammer l'API
let cachedTracks: any[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

export const fetchLofiTracksFromJamendo = async (limit: number = 20): Promise<any[]> => {
  const now = Date.now();
  
  if (cachedTracks.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('🌸 Utilisation du cache Lo-Fi');
    return cachedTracks;
  }

  try {
    console.log('🎵 Récupération de nouvelles pistes Lo-Fi sur Jamendo...');
    const url = `${JAMENDO_BASE_URL}?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&fuzzytags=lofi&order=popularity_total_desc&include=musicinfo`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    const mappedTracks = data.results.map((track: JamendoTrack) => ({
      title: track.name,
      artist: track.artist_name,
      url: track.audio,
      thumbnail: track.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=300&auto=format&fit=crop',
      category: 'relax',
      id: track.id
    }));

    cachedTracks = mappedTracks;
    lastFetchTime = now;
    
    return mappedTracks;
  } catch (error) {
    console.error('❌ Erreur Jamendo:', error);
    // Si l'API échoue, on retourne le cache même s'il est vieux, ou une liste vide
    return cachedTracks.length > 0 ? cachedTracks : [];
  }
};
