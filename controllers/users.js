const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
})

const userModel = mongoose.model("users",userSchema)

module.exports.userModel = userModel
module.exports.registerUser = function registerUser(userEmail,userPassword,userRole){
    return new Promise(async (resolve,reject) => {
        try{
            var userWithEmail = await userModel.findOne({email:userEmail})
            userHashedPassword = bcrypt.hashSync(userPassword,10)
            if(userWithEmail)
            {
                resolve({"STATUS":"ERROR","ERRMSG":"Email Already Exist!"})
            }
            else
            {
                var newUser = new userModel({email:userEmail,password:userHashedPassword,role:userRole})
                newUser.save()
                resolve({"STATUS":"SUCCESS","USER":newUser})
            }
        }
        catch(e)
        {
            resolve({"STATUS":"ERROR","ERRMSG":e})
        }
    })
}

module.exports.loginUser = function loginUser(userEmail,userPassword)
{
    return new Promise(async (resolve,reject) => {
        try
        {
            var userWithEmail = await userModel.findOne({email:userEmail})
            if(userWithEmail)
            {
                var passwordCheck = bcrypt.compareSync(userPassword,userWithEmail.password)
                if(passwordCheck)
                {
                    resolve({"STATUS":"SUCCESS","USER":userWithEmail})
                }
                else
                {
                    resolve({"STATUS":"ERROR","ERRMSG":"Wrong Password!"})
                }
            
            }
            else
            {
                resolve({"STATUS":"ERROR","ERRMSG":"User with Email Not Found!"})
            }
        }
        catch(e)
        {
            resolve({"STATUS":"ERROR","ERRMSG":e})
        }

    })

}


module.exports.getCustomerList = function getCustomerList()
{
    return new Promise(async (resolve,reject) => {
        try
        {
            var users = await userModel.find({role:"customer"})
            if(users)
            {
                resolve({"STATUS":"SUCCESS","USERS": users})
            }
            else
            {
                resolve({"STATUS":"ERROR","ERRMSG":"User with Email Not Found!"})
            }
        }
        catch(e)
        {
            resolve({"STATUS":"ERROR","ERRMSG":e})
        }
        
    })
}