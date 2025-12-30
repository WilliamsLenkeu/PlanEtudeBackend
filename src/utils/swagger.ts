import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PlanÉtude Girly API ✨',
      version: '1.0.0',
      description: 'Documentation de l\'API PlanÉtude avec une touche de rose et de magie. 🍭🎀',
      contact: {
        name: 'PixelCoach Team',
      },
    },
    servers: [
      {
        url: 'https://plan-etude.koyeb.app/api',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Fichiers à scanner pour les annotations
};

export const specs = swaggerJsdoc(options);

// CSS personnalisé pour le style Girly
export const swaggerCustomOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #ff69b4; }
    .swagger-ui .info .title { color: #ff1493; }
    .swagger-ui .opblock.opblock-post { background: rgba(255, 105, 180, 0.1); border-color: #ff69b4; }
    .swagger-ui .opblock.opblock-get { background: rgba(135, 206, 235, 0.1); border-color: #87ceeb; }
    .swagger-ui .btn.execute { background-color: #ff69b4; color: white; border: none; }
    .swagger-ui .btn.execute:hover { background-color: #ff1493; }
    body { background-color: #fff0f5; }
  `,
  customSiteTitle: "PlanÉtude API Docs ✨",
  customfavIcon: "https://em-content.zobj.net/thumbs/120/apple/354/cherry-blossom_1f338.png"
};
