const {authJwt} = require("../middlewares");
const controller = require("../controllers/user.controller");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({storage: storage})

module.exports = function (app) {

    app.get("/api/list-public-file-names", controller.listPublicPhotos);

    app.post("/api/uploadPhoto", [upload.single('myImage'), authJwt.verifyToken], controller.upload)

    app.get("/api/remove/:id", [authJwt.verifyToken], controller.removeFile)

    app.get("/api/list-user-file-names", [authJwt.verifyToken], controller.listUserPhotos)
};
