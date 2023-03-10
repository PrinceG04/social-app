import { db } from "../cofig/db.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = (req, res) => {
    console.log(req.body.username,req.body.password);
    // CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ? "
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("user already exists.");
        // CREATE A NEW USER
    
        // HAS THE PASSWORD
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt);
        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES(?) "
        const values = [req.body.username,req.body.email,hashedPassword,req.body.name];
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });

    // 12345 => "hgsluelnlnxosuolvlaseoruohllcjaosj";

}
const login = (req, res) => {
    // console.log(req.body.username,req.body.password);
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length == 0) return res.status(404).json("User not found!");
        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.status(404).json("Wrong password or username!");
        const token = jwt.sign({id:data[0].id},"secretkey");
        const {password,...remaining} = data[0];

        res.cookie("accessToken",token,{
            httpOnly:true
        }).status(200).json(remaining);
    })

}
const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out.")
};

export { login, register, logout };