import { Mistral } from '@mistralai/mistralai';
import { config } from './env';

const mistral = new Mistral({
  apiKey: config.mistralApiKey,
});

export default mistral;
