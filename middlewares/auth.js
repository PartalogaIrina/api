const jwt = require("jsonwebtoken");
const BlackList = require("../models").BlackList;

/**
 * @swagger
 * components:
 *   schemas:
 *     verifyTokenFailed:
*        type: object
*        properties:
*          message:
*            type: string
*            description: Токен не прошел проверку
*        example:
*          message: "Не верный токен"
 *     verifyTokenExist:
*        type: object
*        properties:
*          message:
*            type: string
*            description: Токен обязателен в заголовке запроса
*        example:
*          message: "Токен не обнаружен"
 */
const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({"message":"Токен не обнаружен"});
    }

    try {
        req.body = await jwt.verify(token, process.env.TOKEN_KEY);

        const ban = await BlackList.findOne({ where: { id: req.body.tokenId } });

        if (ban) throw new Error();

        req.body.token = token;

    } catch (err) {

        return res.status(401).json({"message":"Не верный токен"});
    }

    return next();
};

module.exports = verifyToken;