const mongoose = require("mongoose")
const saltRounds = 10;
const userModel = require("./users").userModel

const permissionsSchema = new mongoose.Schema({
    userId: String,
    redButton: Boolean,
    greenButton: Boolean,
})

const permissionsModel = mongoose.model("permissions",permissionsSchema)

module.exports.addUserPermissions = function addUserPermissions(userId,redButton,greenButton,changinguserid){
    return new Promise(async (resolve,reject) => {
        try{
            var userChanging = await userModel.findOne({_id:changinguserid})
            if(userChanging)
            {
                if(userChanging.role != "admin")
                {
                    resolve({"STATUS":"ERROR","ERRMSG":"You were not admin!"})
                }
            } 
            var userWithID = await permissionsModel.findOne({userId})
            if(userWithID)
            {
                userWithID.redButton = redButton
                userWithID.greenButton = greenButton
                await userWithID.save()
                resolve("SUCCESS")
            }
            else
            {
                var userWithId = await userModel.findOne({_id:userId})
                if(userWithId)
                {
                    newPermissions = new permissionsModel({userId,redButton,greenButton})
                    await newPermissions.save()
                    resolve("SUCCESS")
                }
                else
                {
                    resolve("ERROR")
                }

            }
        }
        catch(e)
        {
            resolve("ERROR")
        }
    })
}

module.exports.retrivePermissions = function retrivePermissions(userId,changinguserid)
{
    return new Promise(async (resolve,reject) => {
        try{
            var userChanging = await userModel.findOne({_id:changinguserid})
            if(userChanging)
            {
                if(userChanging.role != "admin")
                {
                    resolve({"STATUS":"ERROR","ERRMSG":"You were not admin!"})
                }
            } 
            var userWithID = await permissionsModel.findOne({userId})
           if(userWithID)
           {
               resolve({"STATUS":"SUCCESS","USER":userWithID})
           }
           else
           {
                resolve({"STATUS":"ERROR","ERRMSG":"User With That ID not present!"})
           }
        }
        catch(e)
        {
            resolve("ERROR")
        }
    })
}



module.exports.retriveLoggedUserPermissions = function retriveLoggedUserPermissions(userId)
{
    return new Promise(async (resolve,reject) => {
        try{
            var userWithID = await permissionsModel.findOne({userId})
           if(userWithID)
           {
               resolve({"STATUS":"SUCCESS","USER":userWithID})
           }
           else
           {
                resolve({"STATUS":"ERROR","ERRMSG":"User With That ID not present!"})
           }
        }
        catch(e)
        {
            resolve("ERROR")
        }
    })
}