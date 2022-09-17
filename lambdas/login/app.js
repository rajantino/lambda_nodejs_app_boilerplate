const response = require('antinoPms_response');
const loginService = require('./service');
const { loginJoiSchema } = require('antinoPms_login_joiSchema');


exports.lambdaHandler = async (event, context, callback) => {
    try {

        switch (event.httpMethod) {
            case "POST":
                return await login(event);
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

const login = async (event) => {
    try {
        let requestBody = JSON.parse(event.body);
        /* Request Body Validation */
        const { error } = loginJoiSchema.validate(requestBody);
        if (error) {
            let lambdaResponse = await response.prepareResponse(400, {}, error?.details[0]?.message || "Bad Request");
            return lambdaResponse;
        }

        let data = await loginService.login(requestBody);
        let lambdaResponse = await response.prepareResponse(200, data, "success");
        return lambdaResponse;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}