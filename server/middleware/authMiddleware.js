const jwt = require("jsonwebtoken");
const {User}=require("../models");

const protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            const user= await User.findByPk(decoded.id);
            
            req.user = user;
            next();
        }catch(err){
            return res.status(401).json({error:"Not authorized,token failed"})
        }
    }else{
        return res.status(401).json({error:"Not authorized,no token"})
    }



}


module.exports = {protect}