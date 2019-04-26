const router = require('express').Router();
const Image = require('../db').import('../models/image');
const multer = require('multer');
const path = require('path');
const validateSession = require('../middleware/validate-session');

// ! new dependencies
const multerS3 = require('multer-s3');
const fs = require('fs');
const AWS = require('aws-sdk');

//  ! Set up s3
AWS.config.loadFromPath('./s3_config.json');
var s3 = new AWS.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'am-image-db',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})


router.post('/upload', validateSession, upload.single('image'), (req, res) => {
    Image.create({
        location: req.file.location,
        owner_id: req.user.id,
        posted_by: req.user.username
    })
        .then(successData => res.status(200).json({ successData }))
        .catch(err => {
            res.status(500).json({ error: err })
            console.log(err);
        })
});

router.get('/mine', validateSession, (req, res) => {
    Image.findAll({
        where: {
            owner_id: req.user.id
        },
        order: [
            ['id', 'DESC']
        ]
    })
        .then(
            findSuccess = data => {
                res.status(200).json({ userImages: data })
            },

            findError = err => {
                res.status(500).json({ error: err })
            }
        )
})

router.get('/all', (req, res) => {
    Image.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
        .then(images => {
            res.status(200).json({ images })
        })
        .catch(err => res.status(500).json({ error: err }));
})

router.get('/:id', (req, res) => {
    Image.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then(foundImage => {
            // res.status(200);
            res.status(200).json(foundImage);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.put('/:id', validateSession, upload.single('image'), (req, res) => {
    Image.update({
        location: req.file.location,
        votes: 0
    },
        {
            where: {
                owner_id: req.user.id,
                id: req.params.id
            }
        })
        .then(recordsChanged => {
            res.status(200).json( recordsChanged);
        })
        .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:id', validateSession, (req, res) => {
    Image.destroy({ 
        where: { 
            id: req.params.id ,
            owner_id: req.user.id
        } 
    })
        .then(recordsChanged => {
            res.status(200).json(recordsChanged)
        })
        .catch(err => {
            console.log(error);
            res.status(500).json({ error: err });
        });
});

router.put('/up/:id', (req, res) => {
    Image.findOne({ where: { id: req.params.id }})
    .then(image => {
        let newVotes = image.votes + 1;
        Image.update({
            votes: newVotes
        }, 
        {
            where: {
                id: req.params.id
            }
        })
    })
    .then(updateData => res.status(200).send('Vote recorded'))
    .catch(err => res.status(500).json(err))
})

router.put('/down/:id', (req, res) => {
    let currentImage = Image.findOne({ where: { id: req.params.id }})
    .then(image => {
        let newVotes = image.votes - 1;
        newVotes < 0 ? newVotes = 0 : newVotes = newVotes;
        Image.update({
            votes: newVotes
        }, 
        {
            where: {
                id: req.params.id
            }
        })
    })
    .then(data => res.status(200).send('Vote recorded'))
    .catch(err => res.status(500).send(err))
})

module.exports = router;