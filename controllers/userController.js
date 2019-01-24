const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

router.post('/signup', (req, res) => {
    let reqUser = req.body.user;

    User.create({
        username: reqUser.username,
        passwordHash: bcrypt.hashSync(reqUser.password)
    })
    .then(
        createSuccess = user => {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
            res.status(200).json({ user: user, sessionToken: token, message: 'User created' });
        },

        createError = err => {
            res.status(500).json({ error: err });
        }
    )
})

router.post('/signin', (req, res) => {
    let reqUser = req.body.user;

    User.findOne({ where: { username: reqUser.username }})
        .then(function(user) {
            if(user) {
                bcrypt.compare(reqUser.password, user.passwordHash, (err, matches) => {
                    if(matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                        res.status(200).json({
                            user: user,
                            sessionToken: token,
                            message: 'Signed in'
                        });
                    }
                });
            } else {
                res.status(400).json({ error: 'Username or password incorrect' });
            }
        },
        
        function(err) {
            res.status(500).json({ error: 'Username or password incorrect'})
        });
})

module.exports = router;