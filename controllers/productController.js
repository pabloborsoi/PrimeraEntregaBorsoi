const res = require('express/lib/response');
const path = require('path');
const fs = require ('fs');
const { Op } = require("sequelize");
let db = require ("../database/models");
const { validationResult } = require('express-validator');
const { log } = require('console');

const productController = {
    cart: function (req, res) {
        res.render('cart');
    },
    ///////// Llamada al JSON
    index: (req,res) =>{
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        res.render(path.resolve(__dirname, '../views/index'), {camisetas});
    },
    create: (req,res) =>{
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        res.render(path.resolve(__dirname, '../views/product-create'));
    },
    save: (req,res) =>{
        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
			return res.render('product-create', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        let ultimaCamiseta = camisetas.pop();
        camisetas.push(ultimaCamiseta);
        console.log();
        let nuevoProducto = {
            id: ultimaCamiseta.id +1,
            nombre : req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            imagen: req.file.filename
        }

        camisetas.push(nuevoProducto);
        let nuevoProductoGuardar = JSON.stringify(camisetas,null,2);
        fs.writeFileSync(path.resolve(__dirname,'../database/camisetas.json'), nuevoProductoGuardar);
        res.redirect('/');
    },
    show: (req,res) =>{
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        let miCamiseta;
        camisetas.forEach(camiseta => {
            if(camiseta.id == req.params.id){
                miCamiseta = camiseta;
            }
        });
        res.render(path.resolve(__dirname, '../views/detail'), {miCamiseta})

    },

    detail: (req, res) => {
        // 1- CAPTURAMOS EL ID
        // 2- RECORREMOS LOS USUARIOS Y BUSCAMOS LA COINCIDENCIA
        // 3- RENDERIZAMOS LA VISTA CON EL USUARIO QUE COINCIDE
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        const idParam = req.params.id;
        let productoSelected = null
        camisetas.forEach(camiseta => {
            if (camiseta.id == idParam) {
                return productoSelected = camiseta
            }
        })

		res.render("detailProductos", {camiseta: productoSelected});
	},

    edit: (req,res)=>{
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        const modoId = req.params.id;
        let camisetaEditar = camisetas.find(camiseta=> camiseta.id == modoId);
        res.render(path.resolve(__dirname,'../views/product-edit-form'), {camisetaEditar});
    },
    update: (req,res) =>{
        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
			return res.render('product-edit-form', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
        
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        req.body.id = req.params.id;
        req.body.imagen = req.file ? req.file.filename : req.body.oldImagen;
        let camisetasUpdate = camisetas.map(camiseta =>{
            if(camiseta.id == req.body.id){
                return camiseta = req.body;
            }
            return camiseta;
        })
        let camisetaActualizar = JSON.stringify(camisetasUpdate,null,2);
        fs.writeFileSync(path.resolve(__dirname,'../database/camisetas.json'),camisetaActualizar)
        res.redirect('/');
    },
    destroy: (req,res) =>{
        let camisetas = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/camisetas.json')));
        const camisetaDeleteId = req.params.id;
        const camisetasFinal = camisetas.filter(camiseta => camiseta.id != camisetaDeleteId);
        let camisetasGuardar = JSON.stringify(camisetasFinal,null,2)
        fs.writeFileSync(path.resolve(__dirname, '../database/camisetas.json'),camisetasGuardar);
        res.redirect('/');
    },




    //////////////////////CRUD PRODUCTOS SQL
    



    cargarProducto: function (req, res) {
    //sale del alias Genero, muestra todos los generos
    let promMarca = db.Marca.findAll();
    let promTalle = db.Talle.findAll();
    let promCategoria = db.Categoria.findAll();
    Promise.all([promMarca, promTalle, promCategoria])
    .then(([marca, talle, categoria]) => {
        return res.render("creacionProductos", {
            marca,
            talle,
            categoria,
        });
    })
    .catch((error) => res.send(error));
    },


    guardarProducto: function (req, res) {
        const resultValidation = validationResult(req);
    if (resultValidation.errors.length > 0) {
        let promMarca = db.Marca.findAll();
        let promTalle = db.Talle.findAll();
        let promCategoria = db.Categoria.findAll();
        Promise.all([promMarca, promTalle, promCategoria])
            .then(([marca, talle, categoria]) => {
                return res.render("creacionProductos", {
                    marca,
                    talle,
                    categoria,
                    errors: resultValidation.mapped(),
                    oldData: req.body,
                });
            })
            .catch((error) => res.send(error));
        } else if (resultValidation.errors.length == 0)
        db.Productos.create({
            //nombre de las columnas de las bases de dato(ingles)
            //nombres req.body.(name del formulario)
       //id_producto: req.body.producto,
        id_marca: req.body.marca,
        id_talle: req.body.talle,
        id_categoria: req.body.categoria,
        precio: req.body.precio,
    },
    {
        where: {
            id_producto: req.params.id
        }
    })    
    .then(() => {
    res.redirect("/productos/listado");
    })
    .catch((error) => res.send(error));
    },


    listado:function(req,res){

    db.Productos.findAll()
    .then(function(productos){
        
        res.render("listadoProductos", {productos:productos}) 
    })
    },
    detalle: function (req, res) {
    //ByPk sale del id de la url
    console.log('id: ',req.params.id);
    db.Productos.findByPk(req.params.id, {
        
        //los nombres son de las relaciones (as)
        include: [{association: "marca"}, {association: "talle"}, {association: "categoria"}]
    })
        .then(function(producto){
            //console.log(producto.marca.nombre_marca);
            res.render('detalleProducto', {producto:producto});
        })
    },
    editar: function (req, res) {
        //toma el id del url
        console.log('id', req.params.id);
        let pedidoProducto = db.Productos.findByPk(req.params.id);

        let pedidoTalle = db.Talle.findAll();
        let pedidoMarca = db.Marca.findAll();
        let pedidoCategoria = db.Categoria.findAll();

        Promise.all([pedidoProducto, pedidoTalle, pedidoMarca, pedidoCategoria])
        .then(function([producto, talle, marca, categoria]) {
            res.render('editarProducto', {producto:producto, talle:talle, marca:marca, categoria:categoria});
        })
    },
    actualizar: function (req, res) {
        let idEditado = req.params.id;
        const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
        let promProducto =db.Productos.findByPk(idEditado, {
            include: ["marca", "talle", "categoria"],
        });
        let promMarca = db.Marca.findAll();
        let promTalle = db.Talle.findAll();
        let promCategoria = db.Categoria.findAll();
        Promise.all([promProducto, promMarca, promTalle, promCategoria])
            .then(([producto, marca, talle, categoria]) => {
                return res.render("product/productos/editarProductos", {
                    producto,
                    marca,
                    talle,
                    categoria,
                    errors: resultValidation.mapped(),
                    oldData: req.body,
                });
            })
            .catch((error) => res.send(error));
        } else if (resultValidation.errors.length == 0)
        db.Productos.update({
            //nombre de las columnas de las bases de dato(ingles)
            //nombres req.body.(name del formulario)
        //id_producto: req.body.producto,
        id_marca: req.body.marca,
        id_talle: req.body.talle,
        id_categoria: req.body.categoria,
        precio: req.body.precio
        }, {
        where: {
            id_producto: idEditado
        },
    });
    console.log('VER ACAAAAAAA', id_producto);

        //res.redirect('/product/productos/' + req.params.id)
        res.redirect('/product/productos/listado');
    },
    
    borrar: function(req, res) {
        db.Productos.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/product/productos/listado');
    }

};
    

module.exports = productController;