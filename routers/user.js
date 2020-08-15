const router = require("express").Router()
const userController = require("../controllers/users")
const permissionsController = require("../controllers/permissions")
var jwt = require('jsonwebtoken');

router.post("/register",(req,res) => {
    var userEmail = req.body.email
    var userPassword = req.body.password
    var userRole = req.body.role

    userController.registerUser(userEmail,userPassword,userRole).then((result) => {
        if(result.STATUS == "SUCCESS")
        {
            if(userRole == "admin")
            {
                permissionsController.addUserPermissions(result.USER._id,true,true).then((status) => {
                    var token = jwt.sign(result,"s3cret")
                    res.json({token,USER:result.USER})
                })
            }
            else
            {
                permissionsController.addUserPermissions(result.USER._id,false,true).then((status) => {
                    var token = jwt.sign(result,"s3cret")
                    res.json({token,USER:result.USER})
                })
            }
            
        }
        else
        {
            res.json({"ERROR":result.ERRMSG})
        }
    })
})

router.post("/login",(req,res) => {
    var userEmail = req.body.email
    var userPassword = req.body.password

    userController.loginUser(userEmail,userPassword).then((result) => {
        if(result.STATUS == "SUCCESS")
        {
            var token = jwt.sign(result,"s3cret")
            res.json({token,USER:result.USER})           
        }
        else
        {
            res.json({"ERROR":result.ERRMSG})
        }
    })
})

router.post("/getLoggedUserPermissions",(req,res) => {
    try
    {
        var userId = req.body.userId
    
        permissionsController.retriveLoggedUserPermissions(userId).then((result) => {
            if(result.STATUS == "SUCCESS")
            {
                res.json(result)           
            }
            else
            {
                res.json({"ERROR":result.ERRMSG})
            }
        })
    }
    catch(e)
    {
        res.json({"ERROR":e})
    }
})

router.post("/getPermissions",(req,res) => {
    try
    {
        var decoded = jwt.verify(req.body.token, 's3cret');
        var changinguserid = decoded.USER._id
        var userId = req.body.userId
    
        permissionsController.retrivePermissions(userId,changinguserid).then((result) => {
            if(result.STATUS == "SUCCESS")
            {
                res.json(result)           
            }
            else
            {
                res.json({"ERROR":result.ERRMSG})
            }
        })
    }
    catch(e)
    {
        res.json({"ERROR":e})
    }
})

router.post("/updatePermissions",(req,res) => {
    try
    {
        var decoded = jwt.verify(req.body.token, 's3cret');
        var changinguserid = decoded.USER._id
        var userId = req.body.userId
        var redButton = req.body.redButton
        var greenButton = req.body.greenButton
    
        permissionsController.addUserPermissions(userId,redButton,greenButton,changinguserid).then((result) => {
            if(result == "SUCCESS")
            {
                res.json({"STATUS":"SUCCESS"})         
            }
            else
            {
                res.json({"STATUS":"ERROR"})
            }
        })
    }
    catch(e)
    {
        res.json({"ERROR":e})
    }
})


router.post("/getcustomerlist",(req,res) => {
    try
    {
        var decoded = jwt.verify(req.body.token, 's3cret');
        var userRole = decoded.USER.role
        if(userRole == "admin")
        {
            userController.getCustomerList().then((result) => {
                res.json(result)
            })
        }
    }
    catch(e)
    {
        res.json({"ERROR":e})
    }
})

module.exports = router