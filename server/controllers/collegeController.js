const sequelize = require("sequelize");
const { College } = require("../models");

exports.createCollege = async (req, res) => {
    try {
        const { name, city, district, state, latitude, longitude } = req.body;
        if(req.user.role !== "admin"){
            return res.json({error:"Unauthorized"})

        }
        const college = await College.create({
            name,
            city,
            district,
            state,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }

        })
        res.status(201).json({ message: "College created successfully", college })
    } catch (err) {
        res.status(500).json({ error: err.message })

    }
    

}
exports.getAllColleges = async (req, res) => {
    try{
        const colleges = await College.findAll();
        res.status(200).json(colleges);
    }catch(err){
        res.status(500).json({error:err.message})
 
    }
}
exports.deleteCollege = async(req,res)=>{
    try{
        const collegeId = req.params.id;
        const college = await College.findByPk(collegeId);
        if(!college){
            res.status(404).json({error:"college not found"})
        }

        await college.destroy();
        res.status(200).json({message:"college deleted successfully",college})

    }catch(err){
        res.status(500).json({error:err.message})
    
    }
}