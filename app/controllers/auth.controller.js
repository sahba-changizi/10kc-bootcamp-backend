const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        user.save((err) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            res.send({message: "User was registered successfully!"});
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({message: "Invalid Password!"});
            }

            var token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400, // 24 hours
            });

            res.status(200).send({
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                token
            });
        });
};

exports.signout = async (req, res) => {
    try {
        return res.status(200).send({message: "You've been signed out!"});
    } catch (err) {
        this.next(err);
    }
};
