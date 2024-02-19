import { Model } from 'mongoose';

export interface UserFields {
    username: string;
    password: string;
    token: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export interface Task {
    user: Types.ObjectId;
    title: string;
    description?: string;
    status: 'new' | 'in_progress' | 'complete';
}


type UserModel = Model<UserFields, {}, UserMethods>;