
import express from 'express';
import { connectDB } from "./lib/db.js";
import path from 'path';
import { ENV } from './lib/env.js'; 
const app = express();

//gives the current directory path
const __dirname = path.resolve();


app.get('/yash',(req, res) => {
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