const models = require('../../models');
const bcrypt = require('bcrypt');
const Bull = require('bull')
const Joi = require('joi');
const Sequelize = require('sequelize')
const Op = Sequelize.Op

async function listOfUsers (req, res, next) {
    try {
        users = await models.User.findAll({
            include: [
                {
                    model: models.Role,
                    as: 'role'
                }
            ]})
        res.status(200).send({
            users
        })
    }catch(error){
        throw error
    }
}

async function listOfUser(req, res, next) {
    try {
        users = await models.User.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: models.Role,
                    as: 'role'
                }
            ]
        })
        res.status(200).send({
            users
        })
    }catch(error){
        throw error
    }
}

async function createUser(req, res, next) {
    try {
        const reqBody = req.body;
        let schema = await schemaForCreate();
        let u = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            roleId: reqBody.roleId
        }
        const { error, value } = schema.validate(u);
        if(error){
            return res.status(422).send({
                message: (error.details.length) ? error.details[0].message : 'Unprocessable entity'
            })
        }
        let checkIfEmailExits = await checkEmailId({email: reqBody.email, type: 'create'});
        if(checkIfEmailExits){
             return res.status(422).send({
                message: 'Email is already Exists.'
            })
        }
        users = await models.User.create(u);
        const myFirstQueue1 = new Bull('my-first-queue1');
        const job = await myFirstQueue1.add({foo: 'bar'});
        myFirstQueue1.process(async (job) => {
            createPassword(users.id);
            return false;
        });
        res.status(200).send({
            users
        })
    }catch(error){
        throw error
    }
}
async function updateUser(req, res, next) {
    try {
        const reqBody = req.body;
        let schema = await schemaForCreate('edit');
        let u = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            roleId: reqBody.roleId,
            userId: reqBody.userId
        }
        const { error, value } = schema.validate(u);
        if(error){
            return res.status(422).send({
                message: (error.details.length) ? error.details[0].message : 'Unprocessable entity'
            })
        }

        let checkIfEmailExits = await checkEmailId({email: reqBody.email, type: 'edit', id: reqBody.userId});
        if(checkIfEmailExits){
             return res.status(422).send({
                message: 'Email is already Exists.'
            })
        }
        let instance = await models.User.findOne({
            where: { id: reqBody.userId }
        });

        if(!instance){
            return res.status(422).send({
                message: 'Unprocessable entity'
            })
        }

        instance.set(u)
        instance = await instance.save()
        res.status(200).send({
            instance
        })
    }catch(error){
        throw error
    }
}
async function deleteUser(req, res, next) {
    try {
        await models.User.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).send({})
    }catch(error){
        throw error
    }
}

async function createPassword(id){
    let instance = await models.User.findOne({
        where: { id: id }
    });
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("B4c0/\/", salt, async function(err, hash) {
            instance.set({password: hash})
            instance = await instance.save()
        });
    });
}
async function schemaForCreate(type = 'create'){
    let object  = {
        firstName: Joi.required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        roleId: Joi.number().integer().required().min(1).max(2)
    };
    if(type == 'edit'){
        object.userId  = Joi.number().integer().required();
    }
    let schema = Joi.object(object);
    return schema;
}

async function checkEmailId(data){
    let checkObject = { email: data.email };
     if(data.type == 'edit' ){
        checkObject.id = {
            [Op.not]: data.id
        }
    }
    let instance = await models.User.findOne({
        where: checkObject
    });
    if(instance){
        return true;
    }
    return false;
}

module.exports = {
    listOfUsers,
    listOfUser,
    createUser,
    updateUser,
    deleteUser
}
