var assert = require('assert');
const server = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);
const models = require('../models');
const faker = require('faker')

describe('user test cases', function () {
    it('get users', async () => {
        const res = await chai.request(server).get(`api/users`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    })
    it('get user', async () => {
        const res = await chai.request(server).get(`api/user/2`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    })
    it('create user', async () => {
        let createData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            roleId: 2
        }
        const res = await chai.request(server).post(`api/user`).send(createData).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    })

    it('create user - check validations ', async () => {
        let createData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
        }
        const res = await chai.request(server).post(`api/user`).send(createData).end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('array');
            done();
        });
    })

    it('update user', async () => {
        let editData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            roleId: 2,
            userId: 3
        }
        const res = await chai.request(server).put(`api/user`).send(editData).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    })
    it('update user - check validations ', async () => {
        let editData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            roleId: 2,
            userId: 3
        }
        const res = await chai.request(server).put(`api/user`).send(editData).end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('array');
            done();
        });
    })

    it('delete user', async () => {
        let user = await models.User.findOne({
            order: [ [ 'createdAt', 'DESC' ]]
        })
        const res = await chai.request(server).get(`api/user/${user.id}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    })
});
