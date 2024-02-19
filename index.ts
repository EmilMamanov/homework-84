import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config";

import usersRouter from './routes/usersRouter';
import tasksRouter from "./routes/tasksRouter";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
        console.log('disconnected');
    });
};

void run();


