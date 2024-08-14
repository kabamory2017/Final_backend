const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");
const upload = require("..//midlware/upload");

router.post(
  "/api/upload",
  upload.single("file"),
  pictureController.createPicture
);
router.get("/api/upload", upload.single("file"), pictureController.getPicture);

module.exports = router;
