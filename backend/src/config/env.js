import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica .env dalla root del backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

export default process.env;
