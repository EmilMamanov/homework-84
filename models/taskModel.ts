import mongoose, { Schema, Types } from 'mongoose';
import { Task } from "../types";
import User from "./userModel";

const TaskSchema = new Schema<Task>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: async (value: Types.ObjectId) => User.findById(value),
                message: 'User does not exist!',
            },
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        status: {
            type: String,
            enum: ['new', 'in_progress', 'complete'],
            default: 'new',
            required: true,
        },
    },
    { timestamps: true }
);

const TaskModel = mongoose.model('Task', TaskSchema);

export default TaskModel;