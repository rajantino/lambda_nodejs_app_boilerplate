const dao = require('./dao');
const bcrypt = require('bcrypt');
const jwtSecretKey = require('antinoPms_config').getJwtSecret();
const jwt = require('jsonwebtoken');

exports.login = async (data) => {
    try {
        let user = await dao.getUser(data.email);

        if (!Array.isArray(user) || user.length < 1 || !user[0].email) {
            throw { errorCode: 400, message: "user not found" };
        }

        let result = await bcrypt.compare(data.password, user[0].password)

        if (!result) {
            throw { errorCode: 400, message: "email or password is incorrect" };
        }

        const payload = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            email:user[0].email,
            id:user[0].id,
            role:user[0].role
        }

        const token = jwt.sign(payload, jwtSecretKey);

        return {token};
    }
    catch (err) {
        console.log(err);
        throw err;
    }

}