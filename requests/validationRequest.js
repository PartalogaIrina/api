const { body } = require('express-validator');
const { validationResult, checkSchema } = require('express-validator');
const jwt = require("jsonwebtoken");

/**
 * @swagger
 *  components:
 *   schemas:
 *      registerRequest:
 *        type: object
 *        required:
 *          - firstName
 *          - lastName
 *          - email
 *          - password
 *       properties:
 *         firstName:
 *           type: string
 *           maxLength: 30
 *           description: Имя пользователя
 *         lastName:
 *           type: string
 *           maxLength: 30
 *           description: Фамилия пользователя
 *         email:
 *           type: string
 *           maxLength: 100
 *           description: почта пользователя
 *         password:
 *           type: string
 *           minLength: 3
 *           maxLength: 8
 *           description: Пароль пользователя
 *       example:
 *         firstName: "Вася"
 *         lastName: "Пупкин"
 *         email: "exampl@mail.com"
 *         password: "qwert"
 *
 */
exports.register = async (req, res, next) => {
    
    const result = await checkSchema({
        firstName: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            escape: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'Имя не должно быть больше 30 символов',
            }

        },
        lastName: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            escape: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'Имя не должно быть больше 30 символов',
            }

        },
        email: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            toLowerCase: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 100 },
                errorMessage: 'Адрес электронной почты не должен превышать 100 символов',
            },
            isEmail: {
                errorMessage: 'Адрес электронной почты не корректный',
            }
        },
        password: {
            exists: {
                errorMessage: 'Поле должно быть заполнено',
                bail: true
            },
            isLength: {
                options: { min: 5, max: 8 },
                errorMessage: 'Пароль должен быть не меньше 5 и не больше 8 символов',
            }
        },
    }).run(req);

    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    res.status(400).json({ errors: errors.array() });
}

exports.confirm = async (req, res, next) => {
    try {
        req.body = jwt.verify(req.query.tkey, process.env.TOKEN_KEY);

    } catch (err) {
        
        return res.satus(401).send("Invalid token");
    }

    return next();
}