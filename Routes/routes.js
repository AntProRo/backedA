const express = require ('express');
const auth = require('../MiddleWare/auth');
const userController = require('../Controller/user');
const adminController = require('../Controller/admin');
const collaboratorController = require('../Controller/collaborator');
const taskController = require('../Controller/activities');
const projectController = require('../Controller/clients');
const chat = require('../Controller/chatRoom');
const managerPage = require('../Controller/Manager')


const routes = {
    user: express.Router()
    .post('/register',userController.register)
    .post('/login',userController.login)
    .get('/logout',userController.logout)
    .get('/refresh_token',userController.refreshToken)
    .get('/role',auth,userController.getRole)
    .post('/newPassword',userController.restorePassword)
    .get('/info',auth,userController.getInfo),

    admin: express.Router()
    .post('/registerNewUser',auth,adminController.registerNewUserAccount)
    .get('/getAllUser',auth,adminController.getAllUser)
    .get('/getAllManager',adminController.getAllManager)
    .delete('/deleteUserAccount/:id',adminController.deleteUserAccount)
    .post('/deleteUserAccountManager/:id',adminController.deleteUserAccountManager)
    .put('/updateAccount/:id',adminController.updateUserAccount),

    apiCollaborator: express.Router()
    .get('/getCollaboratorInfo/:id',auth,collaboratorController.getInfoCollaborator),

    task:express.Router()
    .post('/newTask',auth,taskController.postAct)
    .get('/getTask/:id',auth,taskController.getAct)
    .put('/updateTask/:id',auth,taskController.updateAct)
    .delete('/deleteTask/:id',auth,taskController.deleteAct),

    project:express.Router()
    .post('/newTechLead',auth,projectController.createTechLeads)
    .get('/getTechLead/:id',auth,projectController.getTechLeads)
    .put('/updateTechLead/:id',auth,projectController.updateTechLeads)
    .delete('/deleteTechLead/:id',auth,projectController.deleteTechLeads)

    .post('/newManager',auth,projectController.createManagers)
    .get('/getManager/:id',auth,projectController.getManagers)
    .put('/updateManager/:id',auth,projectController.updateManagers)
    .delete('/deleteManager/:id',auth,projectController.deleteManagers)

    .post('/newClient',auth,projectController.createClient)
    .get('/getClient',auth,projectController.getClient)
    .put('/updateClient/:id',auth,projectController.updateClient)
    .delete('/deleteClient/:id',auth,projectController.deleteClient),

    chat:express.Router()
    .get('/getDailyComment/:id',auth,chat.getDailyComment)
    .post('/postDailyComment/:id',auth,chat.postDailyComment)
    .get('/getChatRooms',auth,chat.getChatRooms)
    .post('/postComment',auth,chat.postComment),

    manager:express.Router()
    .get('/getAllUserNotAdded',auth,managerPage.getAllUserNotAdded)
    .delete('/addNewUserToMyList/:id',auth,managerPage.updateUserAccount)
}

module.exports = routes