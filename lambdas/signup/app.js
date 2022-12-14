const response = require('antinoPms_response');
const signupService = require('./service');
const userJoiSchema = require('antinoPms_users_joiSchema');


exports.lambdaHandler = async (event, context, callback) => {
    try {

        switch (event.httpMethod) {
            case "POST":
                return await signup(event);
            case "GET":
                return await response.prepareResponse(200, {}, "get");
            case "PUT":
                return await response.prepareResponse(200, {}, "put");
            case "OPTIONS":
                return await response.prepareResponse(200, {}, "preflight");   /* to handle cors issue  */

        }

    } catch (err) {
        const { message = "", errorCode = 400 } = err;
        let lambdaResponse = await response.prepareResponse(errorCode, {}, message || "failure");
        return lambdaResponse;
    }

};


const signup = async (event) => {

    try {
        let requestBody = JSON.parse(event.body);
        /* Request Body Validation */
        const { error } = userJoiSchema.userJoiSchema.validate(requestBody);
        if (error) {
            return await response.prepareResponse(400, {}, error?.details[0]?.message || "Bad Request");
        }

        let data = await signupService.signUp(requestBody);
        let lambdaResponse = await response.prepareResponse(200, data, "success");
        return lambdaResponse;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}