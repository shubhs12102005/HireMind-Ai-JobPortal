import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { MongoConnection } from './utils/db.js';
import UserRoute from './Routes/User_Route.js'
import CompanyRoute from './Routes/Company_Route.js'
import JobRoute from './Routes/Job_Route.js'
import ApplicationRoute from './Routes/Application_Route.js'
import AiRoute from './Routes/Ai_Route.js'

dotenv.config({});
const app = express();
const port = 3000 || process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

// All Api's
app.use('/api/user', UserRoute);
app.use('/api/company', CompanyRoute);
app.use('/api/job', JobRoute);
app.use('/api/application', ApplicationRoute);
app.use('/ai/chat', AiRoute);


app.listen(port, () => {
    MongoConnection();
    console.log(`Server running on http://localhost:${port}`);
})