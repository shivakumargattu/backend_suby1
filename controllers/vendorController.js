const Vendor=require("../models/Vendor");

const jwt=require("jsonwebtoken");

const bcrypt=require("bcrypt");

const dotenv=require("dotenv");
dotenv.config();

const secretkey=process.env.WhatIsYourName


async function vendorRegister(req, res) {
    const { username, email, password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email Already Exist");
        }
        const hashedPassowrd = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email, password: hashedPassowrd
        });
        await newVendor.save();
        res.status(201).json({ message: " Vendor registered successfylly" });
        console.log("Register");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const vendorLogin=async (req,res)=>{
    const {email,password}=req.body;

    try{
        const vendor=await Vendor.findOne({email});
        if(!vendor|| !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid usernanr or password"})
        }

        const token=jwt.sign({vendorId:vendor._id},secretkey, {expiresIn:"2h"})


        res.status(200).json({success:"Login Successful",token})
        console.log(email,"this is token ", token)



    }catch(error){
         
        console.log(error)
        res.status(500).json({error:"Internal or server error"})
    }

}


const getAllVendors=async(req,res)=>{

    try{

   const vendors=await Vendor.find().populate("firm");

    res.json({vendors})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal or server error"})
   

    }
}

const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;
    try {
        
        const vendor=await Vendor.findById(vendorId).populate('firm')

        if(!vendor){
            return res.status(404).json({error:"Vendor is not fond"})
        }
        res.status(200).json({vendor})

    } catch (error) {
         console.log(error)
         res.status(500).json({error:"Internal or server error"})
   
    }
}



module.exports ={vendorRegister,vendorLogin,getAllVendors,getVendorById}