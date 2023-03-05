import {db} from './../cofig/db.js';
import jwt from 'jsonwebtoken';
export const getUser = (req,res) =>{
    // TODO
    const userId = req.params.userId;
    console.log(userId);
    const q = "SELECT * FROM users WHERE id = ?";
    db.query(q,[userId],(err,data)=>{
        if(err) return res.status(500).json(err);
        const {password,...info} = data[0];
        res.status(200).json(info);
    })
    

}
export const updateUser = (req,res) =>{
    const token = req.cookies.accessToken;
    // console.log(token);
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // console.log(userInfo);
        if (err) return res.status(403).json("Token is not valid!");
        const q = "UPDATE users SET `name`=?,`website`=?,`city`=?,`coverPicture`=?,`profilePicture`=? WHERE id=?";
        const values = [
            req.body.name,
            req.body.website,
            req.body.city,
            req.body.coverPicture,
            req.body.profilePicture,
            userInfo.id,
        ];
        db.query(q, [...values], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0)return res.status(200).json("updated!");
            return res.status(403).json("you can update only your profile");
        });
    });
}