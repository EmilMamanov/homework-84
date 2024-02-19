import express from 'express';
import User from '../models/userModel';

import { Error } from 'mongoose';



const usersRouter = express.Router();



usersRouter.post('/', async (req, res, next) => {

    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }
        return next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {


        const user = await User.findOne({username: req.body.username});

        if (!user) {
            return res.status(422).send({error: 'Username not found'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(422).send({error: 'Password is wrong'});
        }

        user.generateToken();
        await user.save();

        return res.send({message: 'Username and password correct!', user});
    } catch (e) {
        next(e);
    }

});

usersRouter.get('/secret', (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');

        if(!headerValue) {
            return res.status(401).send({error: 'No authorization header present'});
        }

        const [bearer, token] = headerValue.split(' ');

        if (!token) {
            return res.status(401).send({error: 'No token present'});
        }

        console.log(token);

        return res.send({message: 'This is a secret message', username: 'Anonymous'});
    } catch (e) {
        next (e);
    }
})



export default usersRouter;