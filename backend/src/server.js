
import express from 'express';
import { connectDB } from "./lib/db.js";
import path from 'path';
import {serve} from 'inngest/express';

import { clerkMiddleware } from "@clerk/express";

import { ENV } from './lib/env.js'; 
import {inngest,functions} from './lib/inngest.js';
import cors from 'cors';

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

//gives the current directory path
const __dirname = path.resolve();

//middlewares
//Helps to read JSON data from the frontend and makes it available in req.body
app.use(express.json()); // Parse JSON request bodies
app.use(cors({origin:ENV.CLIENT_URL,credentials:true})); // Enable CORS for the frontend URL

app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use('/api/inngest',serve({client: inngest, functions}));//all the inngest functions will be available at this endpoint
//meaning of serve here is that it will serve the functions defined in inngest.js file at the endpoint /api/inngest. so whenever we hit this endpoint with a POST request, it will trigger the corresponding function based on the event type in the request body.


app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get('/',(req, res) => {
    res.send('Hello World!');
});

//make our app ready for development and production
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
    });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();