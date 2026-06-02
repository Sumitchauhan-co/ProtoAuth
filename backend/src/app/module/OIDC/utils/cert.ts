import { readFileSync } from 'node:fs';
import path from 'node:path';

export const PRIVATE_KEY = process.env.OIDC_PRIVATE_KEY
    ? process.env.OIDC_PRIVATE_KEY
    : readFileSync(path.resolve('cert/private-key.pem'), 'utf8');

export const PUBLIC_KEY = process.env.OIDC_PUBLIC_KEY
    ? process.env.OIDC_PUBLIC_KEY
    : readFileSync(path.resolve('cert/public-key.pub'), 'utf8');
