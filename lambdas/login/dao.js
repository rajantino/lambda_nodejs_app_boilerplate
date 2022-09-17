const db = require('antinoPms_db');

exports.getUser = async (email)=>{
    try{
        let query = `select * from pmsusers where email = '${email}'`
        let data = await  db.executeQuery(query);
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
   
}