const express = require('express');
const router = express.Router();

const userModel = require('../../models/user');

router.post('/signup', (req, res) => {
    const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    newUser
        .save()
        .then(result => {
            res.json({
                message: 'successful sign up',
                userInfo: {
                    username: result.username,
                    email: result.email,
                    password: result.password,
                    id: result._id
                }
            })
        })
        .catch(err => {
            res.json({
                error: err.message
            });
        });
})

router.post('/login', (req,res) => {

    const userLogin = {
        email: req.body.email,
        password: req.body.password
    };

    res.status(200).json({
        message: 'successful login',
        loginIngo: userLogin
    })
})


module.exports = router;