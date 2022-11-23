const express = require('express');
const router = express.Router();
const path = require('path');
const { body } = require('express-validator');

// Controller
const usersController = require('../controllers/userController');

// Middlewares
const uploadFile = require('../middlewares/multerMiddleware');
const validations = require('../middlewares/validateRegisterMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');


///Validaciones de registro
//Express validator
const validacionesLogin = [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El campo email no puede estar vacío.')
      .bail()
      .isEmail()
      .withMessage('Debe ser un email válido'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('El campo password no puede estar vacío.')
  ];
  const validacionesRegistro = [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar un nombre")
      .bail()
      .isLength({ min: 2 })
      .withMessage("El nombre debe contener al menos 2 caracteres."),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("El campo email no puede estar vacío.")
      .bail()
      .isEmail()
      .withMessage("Debe ser un email válido"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("El campo password no puede estar vacío.")
      .bail()
      .isLength({ min: 8, max: 20 })
      .withMessage(
        "La contraseña debe tener 8 caracteres como mínimo y 20 como máximo"
      ),
    /*body("password2")
      .trim()
      .notEmpty()
      .withMessage("El campo password no puede estar vacío.")
      .bail()
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("Las contraseñas deben coincidir");
        }
        return true;
      }),*/
      body('avatar')
      .custom((value, {req}) => {
        let file = req.file
        let extensionesValidas = ['.jpg','.jpeg','.png','.gif','.tiff']
  
        if(!file){
          throw new Error('Tenes que subir una imagen.')
        } else {
          let fileExtension = path.extname(file.originalname).toLowerCase()
          if(!extensionesValidas.includes(fileExtension)) {
            throw new Error(`Las extensiones de archivo permitidas son: ${extensionesValidas.join(', ')}`)
          }
        }
        return true
      })
  ];


// Cuadro con usuarios
router.get('/json/indexUsers', usersController.indexUsers);

// Formulario de registro
router.get('/json/register', guestMiddleware, usersController.register);

// Procesar el registro
router.post('/json/register', uploadFile.single('avatar'), validations, validacionesRegistro, usersController.processRegister);

// Formulario de login
router.get('/json/login',guestMiddleware, usersController.login);

// Procesar el login
//router.post('/json/login', usersController.loginProcess);
router.post('/json/login',validacionesLogin,usersController.loginProcess);

// Perfil de Usuario
router.get('/json/profile/', authMiddleware, usersController.profile);

// Detalle Usuario
router.get('/json/detail/:id', usersController.detail);

// Editar Usuario
router.get('/json/edit/:id', usersController.edit);

//Guardar editar uduario
router.put("/json/edit/:id", usersController.processEdit)

//Eliminar usuario
router.delete("/json/delete/:id", usersController.destroy)

// Logout
router.get('/json/logout/', usersController.logout);



////////////////////////////CRUD SQL


//CREAR
router.get('/usuarios/crear', usersController.crear);
router.post('/usuarios/crear', usersController.guardado);
//LECTURA
router.get('/usuarios/listado', usersController.listado);
//DETLLE
router.get('/usuarios/:id', usersController.detalle);
//ACTUALIZACION
router.get('/usuarios/editar/:id', usersController.editar);
router.post('/usuarios/editar/:id', usersController.actualizar);
//BORRADO
router.post('/usuarios/borrar/:id', usersController.borrar);

// Formulario de login
router.get('/usuarios/loginSQL', usersController.loginSQL);
router.post('/usuarios/loginSQL',usersController.procesarLoginSQL);

module.exports = router;