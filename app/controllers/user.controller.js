const fs = require("fs");
const User = require("../models/user.model");
const db = require("../models");
const Photo = db.photo;
const {
    Types: {ObjectId: ObjectId},
} = require("mongoose");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};


exports.upload = async (req, res) => {
    let userId = req.userId
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    const userReference = await User.findById(userId).exec();
    const photo = {
        name: `${Date.now()}-${req.file.originalname}`,
        img: {
            data: new Buffer(encode_img, 'base64'),
            contentType: req.file.mimetype,
        },
        owner: userReference
    };
    Photo.create(photo, function (err, result) {
        if (err) {
            res.status(500).send({message: err});
        } else {
            res.status(200).send({message: "Saved To database"});
        }
    })
};

exports.removeFile = (req, res) => {
    let userId = req.userId
    Photo.deleteOne({_id: req.params.id, "owner._id": ObjectId(userId)}).exec((err, photo) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (!photo) {
            res.status(404).send({message: 'Photo not found'});
            return;
        }
        res.send({message: 'File removed successfully'});
    });
};

exports.listPhotos = (req, res) => {
    Photo.find().exec((err, photos) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send(photos.map(photo => photo.name))
    });
};

exports.listPublicPhotos = (req, res) => {
    Photo.find().exec((err, photos) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send(photos.map(photo => {
            return {name: photo.name, imageData: photo.img.data.toString('base64'), id: photo._id, owner: photo.owner.fullName}
        }))
    });
};

exports.listUserPhotos = (req, res) => {
    let userId = req.userId
    Photo.find({"owner._id": ObjectId(userId)}).exec((err, photos) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send(photos.map(photo => {
            return {name: photo.name, imageData: photo.img.data.toString('base64'), id: photo._id, owner: photo.owner.fullName}
        }))
    });
};


