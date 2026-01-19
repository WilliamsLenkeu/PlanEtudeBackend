import mongoose from 'mongoose';
import { config } from '../config/appConfig';
import { Logger } from '../logging/Logger';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      dbName: config.mongodbDbName,
      // Options MongoDB modernes
      maxPoolSize: 10, // Nombre maximum de connexions dans le pool
      serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
      socketTimeoutMS: 45000, // Timeout des sockets
      bufferCommands: false, // Désactiver le buffering des commandes
    });

    Logger.info(`✅ MongoDB connecté: ${conn.connection.host}, DB: ${config.mongodbDbName}`);

    // Gestion des événements de connexion
    mongoose.connection.on('error', (err: any) => {
      Logger.error('❌ Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      Logger.warn('⚠️ MongoDB déconnecté');
    });

    mongoose.connection.on('reconnected', () => {
      Logger.info('✅ MongoDB reconnecté');
    });

  } catch (error) {
    Logger.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB déconnecté proprement');
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion MongoDB:', error);
  }
};

// Classe pour gérer les transactions
export class DatabaseTransaction {
  private session?: mongoose.ClientSession;

  async start(): Promise<void> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
  }

  async commit(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
    }
  }

  async abort(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction();
    }
  }

  async end(): Promise<void> {
    if (this.session) {
      await this.session.endSession();
    }
  }

  getSession(): mongoose.ClientSession | undefined {
    return this.session;
  }

  // Helper pour exécuter une fonction dans une transaction
  static async executeInTransaction<T>(
    operation: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    const transaction = new DatabaseTransaction();

    try {
      await transaction.start();
      const result = await operation(transaction.getSession()!);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.abort();
      throw error;
    } finally {
      await transaction.end();
    }
  }
}

// Utilitaires pour les requêtes avec session
export const withSession = (session?: mongoose.ClientSession) => ({
  session
});

// Vérifier l'état de la connexion
export const getConnectionStatus = (): string => {
  const states = {
    0: 'déconnecté',
    1: 'connecté',
    2: 'connecting',
    3: 'disconnecting'
  };

  return states[mongoose.connection.readyState as keyof typeof states] || 'inconnu';
};