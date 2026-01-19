import winston from 'winston';
import path from 'path';

// Niveaux de log personnalisés
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Appliquer les couleurs
winston.addColors(colors);

// Format personnalisé
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Transports selon l'environnement
const transports: winston.transport[] = [
  // Console pour tous les environnements
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format
    )
  })
];

// En production, ajouter un fichier de logs
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format
    })
  );
}

// Créer le logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false, // Ne pas quitter sur erreur
});

// Méthodes helper pour les logs métier
export class Logger {
  static error(message: string, meta?: any): void {
    logger.error(message, meta);
  }

  static warn(message: string, meta?: any): void {
    logger.warn(message, meta);
  }

  static info(message: string, meta?: any): void {
    logger.info(message, meta);
  }

  static http(message: string, meta?: any): void {
    logger.http(message, meta);
  }

  static debug(message: string, meta?: any): void {
    logger.debug(message, meta);
  }

  // Logs métier spécifiques
  static auth(userId: string, action: string, meta?: any): void {
    logger.info(`Auth: ${action}`, { userId, action, ...meta });
  }

  static api(method: string, path: string, statusCode: number, duration: number, userId?: string): void {
    logger.http(`API: ${method} ${path}`, {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      userId
    });
  }

  static database(operation: string, collection: string, duration: number, error?: any): void {
    const level = error ? 'error' : 'debug';
    logger.log(level, `DB: ${operation} on ${collection}`, {
      operation,
      collection,
      duration: `${duration}ms`,
      error: error?.message
    });
  }

  static business(domain: string, action: string, meta?: any): void {
    logger.info(`Business: ${domain}.${action}`, { domain, action, ...meta });
  }
}

// Middleware pour logger les requêtes HTTP
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.api(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      (req as any).user?.id
    );
  });

  next();
};