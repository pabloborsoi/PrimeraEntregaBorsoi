const express = require('express');
const productRouter = express.Router();
const path = require('path');
const multer = require('multer');
const { body } = require('express-validator');


// REQUERIMOS EL CONTROLADOR PARA DESPUES ACCEDER A SUS METODOS
const productController = require('../controllers/productController');
//Requerir el middleware Ruta Acceso
//const acceso = require(path.resolve(__dirname,'../middlewares/acceso'));

//middlewares import
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware")

//Como podemos indicar para subir el archivo nombre y donde guardarlo
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/images/camisetas'));
    },
    filename: function (req, file, cb) {
      cb(null, 'camiseta-'+Date.now()+path.extname(file.originalname))
    }
  })
   
  const upload = multer({ storage })
  const validacionesCrearProducto = [
    //entre parentesis se toma el Name
    body("nombre")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar un nombre")
      .bail()
      .isLength({ min: 5 })
      .withMessage("El nombre debe contener al menos 5 caracter."),
    body("descripcion")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar una descripción")
      .bail()
      .isLength({ min: 20})
      .withMessage("La descripción debe contener al menos 20 caracteres."),
    body("precio")
      .trim()
      .notEmpty()
      .withMessage("Debes ingresar un precio")
      .bail(),
    body('imagen')
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

  const validacionesEditarProducto = [
  //entre parentesis se toma el Name
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("Debes ingresar un nombre")
    .bail()
    .isLength({ min: 5 })
    .withMessage("El nombre debe contener al menos 5 caracter."),
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("debes ingresar una descripción")
    .bail()
    .isLength({ min: 20})
    .withMessage("La descripción debe contener al menos 20 caracteres."),
  body("precio")
    .trim()
    .notEmpty()
    .withMessage("Debes ingresar un precio")
    .bail(),
  body('imagen')
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


// CONFIFURACION DE RUTAS Y METODOS
productRouter.get('/', productController.index);
productRouter.get('/json/create',authMiddleware,productController.create);
productRouter.post('/json/create', upload.single('imagen'),validacionesCrearProducto, productController.save);
productRouter.get('/json/detail/:id', productController.detail);
productRouter.get('/json/edit/:id',authMiddleware,productController.edit);
productRouter.put('/json/edit/:id',upload.single('imagen'),validacionesEditarProducto,productController.update);
productRouter.get('/json/delete/:id',authMiddleware,productController.destroy);
productRouter.get('/json/cart', productController.cart);
// CONFIFURACION DE RUTAS Y METODOS
//productRouter.get('/json', productController.index);
//productRouter.get('/create',authMiddleware,adminMiddleware,productController.create);
//productRouter.post('/create', upload.single('imagen'), productController.save);
//productRouter.get('/detail/:id', productController.show);
//productRouter.get('/edit/:id',authMiddleware,adminMiddleware,productController.edit);
//productRouter.put('/edit/:id',upload.single('imagen'), productController.update);
//productRouter.get('/delete/:id',authMiddleware,adminMiddleware,productController.destroy);
//productRouter.get('/cart', productController.cart);

///CRUD PRODUCTOS
//CREAR
productRouter.get('/productos/crear',productController.cargarProducto);
productRouter.post('/productos/crear', upload.single('imagen'),productController.guardarProducto);
//LECTURA
productRouter.get('/productos/listado',productController.listado);
//DETALLE
productRouter.get('/productos/:id',productController.detalle);
//ACTUALIZACION
productRouter.get('/productos/editar/:id',productController.editar);
productRouter.put('/productos/editar/:id', productController.actualizar);
//BORRADO
productRouter.post('/productos/borrar/:id', productController.borrar);



module.exports = productRouter;