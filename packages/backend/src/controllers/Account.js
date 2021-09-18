const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const { Account, Session } = require('../models');
const AccountService = require('../services/Account');
const AccountServiceTemplate = require('../configs/service.template.config')(Account);
const SessionService = require('../configs/service.template.config')(Session);

let saltRounds = 7;

/* ````````````Declare your custom controller here `````````````````````*/


/* `````````````````````````````````````````````````````````````````````*/

const create = async (req, res) => {
    let formInput = req.body;

    // If input is null, return 400 Error
    if (!formInput) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your input is null/empty'
        });
    }

    // Validation
    if (formInput.name.length < 7) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your account must be at least 7 characters'
        })
    }
    if (formInput.password.length < 7) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your password must be at least 7 characters'
        })
    }

    // Hash password and save in db
    bcrypt.hash(formInput.password, saltRounds, function (err, hashedPassword) {
        if (err)
            throw new Error(err);
        formInput.hashedPassword = hashedPassword;
        try {
            AccountService.create(formInput);
            return res.status(201).json({
                statusCode: 201,
                message: 'Create account successfully'
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err.message || 'Some errors occur while creating account'
            });
        }
    });
}

const login = async (req, res) => {
    let input = req.body;

    // check account
    let checkAccount, checkPassword, role, userId;
    let accountList = await AccountServiceTemplate.find().lean();
    for (let i = 0; i < accountList.length; i++) {
        if (accountList[i].name === input.name) {
            checkAccount = true;
            role = accountList[i].role;
            userId = accountList[i]._id;
        }
        await bcrypt.compare(input.password, accountList[i].hashedPassword).then(function(result) {
            if (result === true)
                checkPassword = true;
        });
    }
    if (!checkAccount || !checkPassword)
        return res.status(400).json({
            statusCode: 400,
            message: 'Login failed'
        });
    
    // set session
    let id = nanoid();
    try {
        const newSession = new Session({
            sessionId: id,
            role,
            userId
        });
        await newSession.save();
        res.cookie('sessionId', id, {
            signed: true
        });
        return res.status(201).json('Login successfully');
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors happened`
        });
    }
}

const sendRole = async (req, res) => {
    // check if session in db
    try {
        let session = req.signedCookies.sessionId;
        console.log(session);
        let sessionList = await SessionService.find();
        for (let i = 0; i < sessionList.length; i++) {
            if (session === sessionList[i].sessionId) {
                return res.status(201).json({
                    role: sessionList[i].role
                });
            }
        }
        return res.status(400).json({
            message: 'Fake session'
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors happened`
        });
    }
}

const logOut = (req, res) => {
    res.clearCookie('sessionId');
    res.status(200).json({
        statusCode: 200,
        message: 'Log out successfully'
    });
}

const changePassword = async (req, res) => {
    let input = req.body;
    // validation new password
    if (input.newPassword.length < 7) {
        return res.status(400).json({
            statusCode: 400,
            message: 'New password must be at least 7 characters'
        })
    }

    // check old password
    let account = await AccountServiceTemplate.findOne(input.id);
    let checkPassword = bcrypt.compareSync(input.oldPassword, account.hashedPassword);
    if (checkPassword) {
        let newHashedPassword = bcrypt.hashSync(input.newPassword, saltRounds);
        account.hashedPassword = newHashedPassword;
        await AccountServiceTemplate.update(input.id, account);
        return res.status(200).json({
            statusCode: 200,
            message: 'Change password successfully'
        })
    }

    // if old password is wrong
    return res.status(400).json({
        statusCode: 400,
        message: 'Wrong password'
    });
}

const getUserId = async (req, res) => {
    // check if session in db
    try {
        let session = req.signedCookies.sessionId;
        let sessionList = await SessionService.find();
        for (let i = 0; i < sessionList.length; i++) {
            if (session === sessionList[i].sessionId) {
                return res.status(201).json({
                    userId: sessionList[i].userId
                });
            }
        }
        return res.status(400).json({
            message: 'Fake session'
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors happened`
        });
    }
}

module.exports = {
    create,
    login,
    logOut,
    sendRole,
    changePassword,
    getUserId
}