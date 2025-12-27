import mongoose from 'mongoose';
import User from './src/models/User.model';
import Planning from './src/models/Planning.model';
import Progress from './src/models/Progress.model';
import ChatHistory from './src/models/ChatHistory.model';
import Reminder from './src/models/Reminder.model';
import Badge from './src/models/Badge.model';
import RefreshToken from './src/models/RefreshToken.model';

async function clearDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Clear all collections
    const collections = [
      { name: 'User', model: User },
      { name: 'Planning', model: Planning },
      { name: 'Progress', model: Progress },
      { name: 'ChatHistory', model: ChatHistory },
      { name: 'Reminder', model: Reminder },
      { name: 'Badge', model: Badge },
      { name: 'RefreshToken', model: RefreshToken }
    ];

    for (const collection of collections) {
      const count = await collection.model.deleteMany({});
      console.log(`✓ Cleared ${collection.name}: ${count.deletedCount} documents deleted`);
    }

    console.log('\n✓ Database cleared successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
