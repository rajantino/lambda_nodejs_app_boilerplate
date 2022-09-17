const dao = require('./dao');
const bcrypt =require('bcrypt');

exports.signUp = async (data)=>{
    try{
        data.password = await bcrypt.hash(data.password,10);
        let result = await dao.signUp(data);
        return result;
    }
    catch(err){
        console.log(err);
        throw err;
    }
   
}