const User=require('../models/User');

const toUserProfile=async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select(); // this is set after jwt verification in auth middleware.
        if(!user){
            return res.status(404).json({message:'User not found!'});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

module.exports=toUserProfile;