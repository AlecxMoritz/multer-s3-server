const router = require('express').Router();
const Image = require('../db').import('../models/image');
const multer = require('multer');
const path = require('path');
const validateSession = require('../middleware/validate-session');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage, fieldSize: 1000 });

router.get('/', (req, res) => {
    res.json({ message: "test passed" })
})

router.post('/upload', validateSession, upload.single('image'), (req, res) => {
    options = { multi: true };
    Image.create({
        path: req.file.path,
        owner_id: req.user.id,
    })
        .then(successData => res.status(200).json({ successData }))
        .catch(err => res.status(500).json({ error: err }))
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
    Image.findAll()
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
            res.sendFile(path.resolve('./' + foundImage.path))
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.put('/:id', validateSession, upload.single('image'), (req, res) => {
    Image.update({
        path: req.file.path
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

module.exports = router;