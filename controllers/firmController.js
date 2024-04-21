const Firm =require("../models/Firm");
const Vendor=require("../models/Vendor");

const multer=require("multer");



    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
        }
      });
      
      const upload = multer({ storage: storage });




const addFirm=async(req,res)=>{
try{
    const {firmName,area,category,offer,region}=req.body;
     
    
   const image=req.file?req.file.filename:undefined;

    const vendor=await Vendor.findById(req.vendorId)
    
    if(!vendor){
        res.status(404).json({message:"vendor not found"})
    }

    const firm=new Firm({
        firmName,area,category,offer,region,image,vendor:vendor._id
    })
    
    const savedFirm=await firm.save()

    vendor.firm.push(savedFirm)

  await vendor.save()

    return res.status(200).json({message:"firm addes successfully"})
}

catch(erroe)
{
console.log(error)
res.status(500).json({error:"internal server Error"})

}


}

const deleteFirmById=async(req,res)=>{

  try {

    const firmId=req.params.firmId;
    const delectfirm=await Firm.findByIdAndDelete(firmId)
    if(!delectfirm){
      res.status(500).json({error:"Internal or server Error"})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"internal or server error"})
   
  }
}

module.exports = {addFirm:[upload.single("image"),addFirm],deleteFirmById}