import { db } from "../cofig/db.js";
import moment from 'moment';
import jwt from 'jsonwebtoken';
export const getPosts = (req, res) => {
    const userId = req.query.userId;
    // console.log(userId);


    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        // console.log(userInfo.id)
        // console.log(userId);
        // userId?console.log('defined'):console.log('undefined');
        const q = userId != "undefined" ? (`SELECT p.*, name,profilePicture FROM posts AS p JOIN users AS u ON (p.userId = u.id) WHERE userId = ? ORDER BY p.createdAt DESC`) : (`SELECT DISTINCT p.*,u.id AS userId, name,profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC`);
        // let values;
        // console.log(q);
        const values = userId != "undefined" ? ([userId]) : ([userInfo.id, userInfo.id]);
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });

}
export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO posts (`desc`,`image`,`createdAt`,`userId`) VALUES (?)";
        const values = [
            req.body.desc,
            req.body.image,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,]
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created.");
        });
    });
}
export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "DELETE FROM posts WHERE `id` = ? AND `userId`=?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
            return res.status(403).json("You can delete only your post.")
        });
    });
}