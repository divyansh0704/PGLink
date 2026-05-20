const {Request}= require("../models");

const createRequest = async(req,res)=>{
    try{
        const {name,city,district,state} = req.body;
        const userId = req.user.id; // Get the ID from the protect middleware

        const request = await Request.create({
            name,
            city,
            district,
            state,
            userId
        })
        res.status(201).json({message:"Request created successfully",request})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

const getRequestsByUser = async(req,res)=>{

    try{
        const userId = req.user.id;
     const requests = await Request.findAll({where:{userId}});
     res.status(200).json(requests);

    }catch(err){
        res.status(500).json({error:err.message})
    }
     

}

module.exports = {createRequest,getRequestsByUser}