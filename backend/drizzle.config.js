import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn(
        '⚠️ Warning: DATABASE_URL is empty in drizzle.config.js. Falling back to command line flags if provided.',
    );
}

export default defineConfig({
    out: './drizzle',
    // schema: './src/common/db/schema.ts',
    schema: './src/**/*.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
