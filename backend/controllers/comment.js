import { db } from "../cofig/db.js";
import moment from 'moment';
import jwt from 'jsonwebtoken';
export const getComments = (req, res) => {
        // console.log(req.query.postId);
        const q = `SELECT c.*,profilePicture,name FROM comments AS c JOIN users AS u ON(c.userId = u.id) WHERE c.postId = ? ORDER BY createdAt DESC`;
        db.query(q,[req.query.postId],(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
}
export const addComment = (req, res) => {

    const token = req.cookies.accessToken;
    // console.log(token);
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // console.log(userInfo);
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO comments (`desc`,`createdAt`,`userId`,`postId`) VALUES (?)";
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId,
        ]
        console.log(values);
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created.");
        });
    });

}