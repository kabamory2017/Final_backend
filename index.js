const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const connectDB = require("./config.js/db");

app.use(express.json());
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT;
const errorHandle = require("./midlware/errorHandler");

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

const productRoute = require("./routes/productsRoute");
const categorytRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const pictureRoute = require("./routes/pictureRoutes");
app.use("/uploads", express.static("public/Images"));

app.use("/api/products", productRoute);
app.use("/api/category", categorytRoute);
app.use("/api/user", userRoute);
app.use("", pictureRoute);
// app.use(errorHandle)

// Set up storage engine for multer
// const storage = multer.diskStorage({
//     destination: 'public/Images',
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
//   });

//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 }, // Limit file size to 1MB
//     fileFilter: (req, file, cb) => {
//       checkFileType(file, cb);
//     },
//   }).single('file'); // Expect a single file with the field name 'image'

//   function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images Only!');
//     }
//   }

//   app.post('/api/upload',  (req, res) => {
//     upload(req, res, (err) => {
//       if (err) {
//         res.status(400).json({ message: err });
//       } else {
//         if (req.file == undefined) {
//           res.status(400).json({ message: 'No file selected' });
//         } else {
//           res.json({
//             message: 'File uploaded successfully',
//             file: `uploads/${req.file.filename}`,
//           });
//           console.log( req.file)
//           Picture.create(
//             {
//                 avatar:req.file.filename

//             }
//          )

//         }
//       }
//     });

//   });
//   app.get('/api/upload',async(req,res)=>{
//     try {
//         const all_datas = await Picture.find()
//         res.status(200).json({  success:true,all_data:all_datas})
//     } catch (error) {
//         return res.status(500).json({message: error})
//     }

// })
// app.get('/api/upload/:id',async(req,res)=>{
//     try {
//         const all_datas = await Picture.findById(req.params.id)
//         res.status(200).json({  success:true,all_data:all_datas})
//     } catch (error) {
//         return res.status(500).json({message: error})
//     }

// })

// Serve static files from the uploads directory
// app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected");
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("connection failed");
  });
