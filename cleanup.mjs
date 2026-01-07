import { rm } from 'fs/promises';

// Remove temp, lib, and esm directories
await rm('temp', { recursive: true, force: true });
await rm('lib', { recursive: true, force: true });
await rm('esm', { recursive: true, force: true });

console.log('✓ Cleaned up temp, lib, and esm directories');
