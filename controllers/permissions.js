const mongoose = require("mongoose")
const saltRounds = 10;
const userModel = require("./users").userModel

const permissionsSchema = new mongoose.Schema({
    userId: String,
    redButton: Boolean,
    greenButton: Boolean,
})

const permissionsModel = mongoose.model("permissions",permissionsSchema)

module.exports.addUserPermissions = function addUserPermissions(userId,redButton,greenButton){
    return new Promise(async (resolve,reject) => {
        try{
            var userWithID = await permissionsModel.findOne({userId})
            if(userWithID)
            {
                userWithID.redButton = redButton
                userWithID.greenButton = greenButton
                await userWithID.save()

                resolve({"STATUS":"SUCCESS"})
            }
            else
            {
                newPermissions = new permissionsModel({userId,redButton,greenButton})
                await newPermissions.save()
                resolve({"STATUS":"SUCCESS"})
            }
        }
        catch(e)
        {
            resolve({"STATUS":"ERROR","ERRMSG":e})
        }
    })
}