import express from 'express';
import Task from '../models/taskModel';
import auth, { RequestWithUser } from '../auth';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res) => {
    try {
        const newTask = new Task({
            user: req.user?._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        await newTask.save();
        res.status(201).send(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res) => {
    try {
        const tasks = await Task.find({ user: req.user?._id });
        res.send(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res) => {
    try {
        const taskId = req.params.id;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, user: req.user?._id },
            {   title: req.body.title,
                description: req.body.description,
                status:req.body.status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        res.send(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: req.user?._id });

        if (!deletedTask) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        res.send({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Internal Server Error' });
    }
});

export default tasksRouter;
