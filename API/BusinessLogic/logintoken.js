var tokenization=require('../../custom_modules/tokenization');
const dbmgr=require('../../custom_modules/dbInstance');

class logintoken
{
    async input(req,message)
    {  
            message.USER_NAME=req.body.userName;   
            message.PASSWORD=req.body.password;    
    }
    async process(message)
    {
        //user name pass validation logic
        message.STATUS="UnAuthorized";
        var client=dbmgr.getDbClient();
        
        var results=await client.Query("select * from users where userid=? and password=?",[message.USER_NAME,message.PASSWORD]);
        if(results.length>0)
        {
            message.STATUS="Success";
            message.RESOURCE_TOKEN=tokenization.generateUserToken(message.USER_NAME);
        }
        else
        {
            message.ERROR_MESSAGE="Invalid User Name Password Provided";
        }
       
    }
    async output(res,message)
    {
        res.responseBody.token=message.RESOURCE_TOKEN;
        res.responseBody.status=message.STATUS;
        res.responseBody.errorMessage=message.ERROR_MESSAGE;
    }
    inputValidation(req)
    {

    }
    
}
module.exports= new logintoken();
