import { rm } from 'fs/promises';

// Remove temp and lib directories
await rm('temp', { recursive: true, force: true });
await rm('lib', { recursive: true, force: true });

console.log('✓ Cleaned up temp and lib directories');
