const response = require('antinoPms_response');
const profileService = require('./service');
const roleMiddleware = require('antinoPms_middlewares').verifyRole;
const { adminRole, userRole } = require('antinoPms_config').getRoles();

exports.lambdaHandler = async (event, context, callback) => {
    try {

        /* 
        this is just a dummy lambda function to test role based authorization, 
        the data this lambda returns is only accessible to Admin users
        */


        switch (event.httpMethod) {
            case "POST":
                return await response.prepareResponse(200, {}, "post");
            case "GET":
                return await profile(event);
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

const profile = async (event) => {

    try {
        let { isAuthorised, userId } = await roleMiddleware(event.headers.Authorization, adminRole);

        /* if not authorised middleware itself will throw the exception */
        if (isAuthorised) {
            return await response.prepareResponse(200, { someData: "this is only for Admin users" }, "success");
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}