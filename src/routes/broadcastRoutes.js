const broadcastController = require('../controllers/broadcastControllers.js');
const UseConnection = require('../middlewares/UseConnection.js');
const validations = require('../middlewares/GeneralValidations.js');
const token = require('../middlewares/authenticate.js');
const checkTypeUser = require('../middlewares/checkTypeUser.js');
const limitAccess = require('../middlewares/limitAccess.js');
const express = require("express");
const api = express.Router();
// Te explico la estructura 
//          ruta                    milddlewares               |-función/metodo que se va aplicar a la ruta -|
//                      conexion a la base      validacion 
api.get('/broadcastBaby/:_id', [UseConnection.getPool, token.authenticateToken, checkTypeUser, limitAccess(1)], (...args)=> broadcastController.broadcastBaby(...args));
api.get('/broadcastBabyForCaregiver/:_id/:id_bebe', [UseConnection.getPool, token.authenticateToken, checkTypeUser, limitAccess(2)], (req, res) => broadcastController.broadcastBabyForCaregiver(req, res));
api.post('/newUserAlert', [UseConnection.getPool], (...args)=> broadcastController.newUserAlert (...args));
module.exports = api;