//IMPORTANDO MODULOS
let express= require ('express');
let router = express.Router();

//IMPORTANDO CONTROLADORES
const apiController = require ('../controllers/apiController');


//DEFINIENDO RUTAS
//Rutas Usuario Viejas
//router.get('/usuarios/listado', usersController.listado);
//router.get('/usuarios/:id', usersController.detalle);

//Rutas Usuario Nuevas
router.get ('/usuarios/listado', apiController.listarUsuarios);
router.get ('/usuarios/:id', apiController.detalleUsuario);

//Rutas api productos
//productRouter.get('/productos/listado', productController.index);
router.get ('/productos/listado', apiController.listarProductos);
//productRouter.get('/productos/:id',productController.detalle);
router.get ('/productos/:id', apiController.detalleProducto);

router.get ('/marcas/listado', apiController.listarMarcas);
router.get ('/marcas/:id', apiController.listarMarcas);


module.exports = router