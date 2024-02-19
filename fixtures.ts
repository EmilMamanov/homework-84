import mongoose from "mongoose";
import config from "./config";
import TaskModel from "./models/taskModel";
import UserModel from "./models/userModel";
import {randomUUID} from "crypto";


const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
    try {
        await db.dropCollection('users');

        await db.dropCollection('tasks');
    } catch (e) {
        console.log(`Collection ${collectionName} is missing, skipping drop...`);
    }

};

const run = async () => {
    await mongoose.connect(config.mongoose.db)
    const db = mongoose.connection;

    const collections = ['users', 'tasks'];
    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    const user1 = await UserModel.create({
        username: 'john1',
        password: 'doe1',
        token: randomUUID(),
    });

    const user2 = await UserModel.create({
        username: 'john2',
        password: 'doe2',
        token: randomUUID(),
    });

    await TaskModel.create({
        user: user1._id,
        title: 'Task1',
        description: 'Description task1',
        status: 'new',
    });

    await TaskModel.create({
        user: user2._id,
        title: 'Task2',
        description: 'Description task2',
        status: 'in_progress',
    });

    await TaskModel.create({
        user: user2._id,
        title: 'Task3 User2',
        description: 'Description task3 user2',
        status: 'in_progress',
    });

    await db.close();
};

void run();