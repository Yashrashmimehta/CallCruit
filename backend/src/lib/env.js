import dotenv from 'dotenv';
dotenv.config({quiet: true}); // Load environment variables from .env file
export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL, 
    INNGEST_SECRET_KEY: process.env.INNGEST_SECRET_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,
}