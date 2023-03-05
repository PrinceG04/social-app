import { db } from '../cofig/db.js';
import jwt from 'jsonwebtoken';
export const getRelationships = (req, res) => {
    // console.log(req.query);
    const q = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;
    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        // console.log(data);
        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    });
}


export const delRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    // console.log(token);
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // console.log(userInfo);
        if (err) return res.status(403).json("Token is not valid!");
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
        console.log(req.query);
        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("unfollow.");
        });
    });

}


export const addRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    // console.log(token);
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // console.log(userInfo);
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.userId,
        ]
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("following.");
        });
    });

}