const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const validateSession = require('../middleware/validate-session');

router.get('/me', validateSession, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
    .then(
        findSuccess = user => {
            res.status(200).json({
                username: user.username,
                bio: user.bio,
                status: user.status
            });
        },

        findError = err => {
            res.status(500).json(err)
        }
    )
})

router.put('/profile', validateSession, (req, res) => {
    let reUser = req.body.user
    console.log(req.body.user);
    User.update({
        // username: reUser.username,
        bio: reUser.bio,
        status: reUser.status
    },
    {
        where: {
            id: req.user.id
        }
    })
    .then(
        updateSuccess = recordsChanges => {
            res.status(200).json(recordsChanges);
        },

        updateError = err => {
            res.status(500).json(err);
        }
    )
})

router.post('/signup', (req, res) => {
    let reqUser = req.body.user;
    console.log(req.body);
    User.create({
        username: reqUser.username,
        passwordHash: bcrypt.hashSync(reqUser.password),
        email: reqUser.email,
        bio: "",
        status: ""
    })
        .then(
            createSuccess = user => {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                res.status(200).json({ user: user, sessionToken: token, message: 'User created' });
            },

            createError = err => {
                res.status(500).json({ error: err });
                console.log(err);
            }
        )
})

router.post('/signin', (req, res) => {
    let reqUser = req.body.user;

    User.findOne({ where: { username: reqUser.username } })
        .then(function (user) {
            if (user) {
                bcrypt.compare(reqUser.password, user.passwordHash, (err, matches) => {
                    if (matches) {
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

            function (err) {
                res.status(500).json({ error: 'Username or password incorrect' })
                console.log(err);
            });
})

module.exports = router;