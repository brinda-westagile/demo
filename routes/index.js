const router = require('express').Router()
const { listOfUsers, listOfUser, createUser, updateUser, deleteUser } = require('../controllers/user')
console.log('routes');


router.get('/users', listOfUsers)
router.get('/user/:id', listOfUser)
router.post('/user', createUser)
router.put('/user', updateUser)
router.delete('/user/:id', deleteUser)

module.exports = exports = router
