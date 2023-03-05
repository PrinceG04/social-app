import express from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import relationshipRoutes from './routes/relationships.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { upload } from "./services/upload.js";
const app = express();

// middlewares
// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Credentials",true)
//     next();
// })
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relationships', relationshipRoutes);


app.post("/api/upload", upload.single("file"), (req, res) => {
    // console.log(req.file);
    const file = req.file;
    res.status(200).json(file.filename);
})

// app.get('/',(req,res)=>{
//     res.send("hello");
// })
app.listen(8080, () => {
    console.log('API working');
});