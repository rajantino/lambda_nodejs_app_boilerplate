 const response = require('antinoPms_response');
 const db = require('antinoPms_db');
 const signupService = require('./service');
 const userJoiSchema = require('antinoPms_users_joiSchema');


 exports.lambdaHandler = async (event, context, callback) => {
    try {
        let requestBody = JSON.parse(event.body);
        /* Request Body Validation */
        const { error } =  userJoiSchema.userJoiSchema.validate(requestBody);
        if(error){
            let lambdaResponse = await response.prepareResponse(400, error, "Bad Request");
             return lambdaResponse;
        }
     
     let data = await  signupService.signUp(requestBody);
     let lambdaResponse = await response.prepareResponse(200, data, "success");
     return lambdaResponse;

    } catch (err) {
        const {message="", code=""} = err;
        let lambdaResponse = await response.prepareResponse(400, {message,code}, "failure");
        return lambdaResponse;
    }

};
