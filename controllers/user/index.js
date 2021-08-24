const models = require('../../models');
const bcrypt = require('bcrypt');
const Bull = require('bull')
const Joi = require('joi');
const Enjoi = require('enjoi');

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
        let schema = schemaForCreate();
        let u = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            roleId: reqBody.roleId
        }
        const { error, value } = schema.validate(u);
        console.log(error,'error');
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
        let instance = await models.User.findOne({
            where: { id: reqBody.userId }
        });
        let u = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            roleId: reqBody.roleId
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
async function schemaForCreate(){
    let schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        roleId: Joi.integer().required().min(1).max(2)
    })
    joiSchema = Enjoi.schema(schema);
    return joiSchema;
}

module.exports = {
    listOfUsers,
    listOfUser,
    createUser,
    updateUser,
    deleteUser
}
