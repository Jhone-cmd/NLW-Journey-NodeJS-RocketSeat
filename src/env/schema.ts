import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string().url(),
    API_BASE_URL: z.string().url(),
    API_WEB_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) { 
    console.error('⚠️ Invalid Variables Environment', _env.error.format());
    throw new Error('⚠️ Invalid Variables Environment');
}

export const env = _env.data;