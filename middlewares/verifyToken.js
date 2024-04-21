const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv")

dotenv.config()

const secretkey=process.env.WhatIsYourName


const verifyToken=async(req,res,next)=>{
    const token=req.headers.token;
    if(!token){
        return res.this.status(401).json({error:"Token is Required"})
    }
    try {
        
        const  decoded=jwt.verify(token,secretkey)
        const vendor=await Vendor.findById(decoded.vendorId)
        if(!vendor){
            return res.status(404).json({error:"vender is not found"})
        }
        req.vendorId=vendor._id

        next()
    } catch (error) {
        console.log(error)
       return res.status(500).json({error:"Invalid token "})
    }
}

module.exports= verifyToken