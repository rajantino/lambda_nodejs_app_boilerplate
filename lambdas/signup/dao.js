const db = require('antinoPms_db');

exports.signUp = async (user)=>{
    try{
        let query = `insert into pmsusers (firstName,lastName,email,password,role ) values('${user.firstName}','${user.lastName}','${user.email}','${user.password}','${user.role}')`
        let data = await  db.executeQuery(query);
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
   
}