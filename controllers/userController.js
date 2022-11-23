const res = require('express/lib/response');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const fs = require ('fs');
const path = require('path');
const User = require('../models/User');
const { Op } = require("sequelize");
let db = require ("../database/models");
const users = User.findAll();

const controller = {
	indexUsers: function (req, res) {
		const users = User.findAll();
		return res.render('indexUsers',{users});
	},
	register: (req, res) => {
		return res.render('userRegisterForm');
	},
	processRegister: (req, res) => {
		const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) {
			return res.render('userRegisterForm', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}

		let userInDB = User.findByField('email', req.body.email);

		if (userInDB) {
			return res.render('userRegisterForm', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},
				oldData: req.body
			});
		}

		let userToCreate = {
			...req.body,
			password: bcryptjs.hashSync(req.body.password, 10),
			avatar: req.file.filename
		}

		let userCreated = User.create(userToCreate);

		return res.redirect('/user/json/login');
	},
	login: (req, res) => {
		return res.render('userLoginForm');
	},
	loginProcess: (req, res) => {
		const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) {
			return res.render('userLoginForm', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}

		let userToLogin = User.findByField('email', req.body.email);
		
		if(userToLogin) {
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
			if (isOkThePassword) {
				delete userToLogin.password;
				req.session.userLogged = userToLogin;

				if(req.body.remember_user) {
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}

				return res.redirect('/user/json/profile');
			} 
			return res.render('userLoginForm');
			/*, {
				errors: {
					email: {
						msg: 'Las credenciales son inválidas'
					}
				}
			});*/
		}

		return res.render('userLoginForm')
		/*, {
			errors: {
				email: {
					msg: 'No se encuentra este email en nuestra base de datos'
				}
			}
		});*/
	},
	edit: (req, res) => {
        // 1- CAPTURAMOS EL ID
        // 2- RECORREMOS LOS USUARIOS Y BUSCAMOS LA COINCIDENCIA
        // 3- RENDERIZAMOS LA VISTA CON EL USUARIO QUE COINCIDE
        const idParam = req.params.id;
        let userSelected = null
        users.forEach(user => {
            if (user.id == idParam) {
                return userSelected = user
            }
        })
		res.render("editUsers", {user: userSelected});
	},
    processEdit: (req, res) => {
        // 1- CAPTURAMOS EL ID
        // 2- CAPTURAMOS LA DATA INGRERSADA POR EL USUARIO
        // 3- DEFINIMOS LA NUEVA VARIABLE CON LO QUE INGRESO EL USUARIO
        // 4- EDITAMOS EL ELEMENTO CON IDPARAMS - 1 CON EL VALOR DE LA VARIABLE 
        // 5- REDIRIGIMOS AL INDEX
        const idParam = req.params.id;
        const data = req.body;
		let userEdited = {
            id: idParam,
			...data,
		};
		users[idParam - 1] = userEdited;
        res.redirect('/user/json/indexUsers')
    },
	detail: (req, res) => {
        // 1- CAPTURAMOS EL ID
        // 2- RECORREMOS LOS USUARIOS Y BUSCAMOS LA COINCIDENCIA
        // 3- RENDERIZAMOS LA VISTA CON EL USUARIO QUE COINCIDE
        const idParam = req.params.id;
        let userSelected = null
        users.forEach(user => {
            if (user.id == idParam) {
                return userSelected = user
            }
        })

		res.render("detailUsers", {user: userSelected});
	},
	profile: (req, res) => {
		return res.render('userProfile', {
			user: req.session.userLogged
		});
	},
	delete: (req, res) => {
        const idParam = req.params.id;
        let usersArray = users.filter(user => user.id != idParam);
        // res.redirect("/")
        res.render('indexUsers', {users: usersArray })
    },
	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	},
	destroy: (req,res) =>{
        let usuarios = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../database/users.json')));
        const usuariosDeleteId = req.params.id;
        const usuariosFinal = usuarios.filter(usuarios => usuarios.id != usuariosDeleteId);
        let usuariosGuardar = JSON.stringify(usuariosFinal,null,2)
        fs.writeFileSync(path.resolve(__dirname, '../database/users.json'),usuariosGuardar);
        res.redirect('/user/json/indexUsers');
    },




	///////////////CRUD  USUARIO SQL




	crear: function (req, res) {
		//sale del alias Genero, muestra todos los generos
		db.Usuarios.findAll()
		.then(function(usuario){
		return res.render("creacionUsuarios", {usuario:usuario});
		})
	},
	listado: function(req,res){

		db.Usuarios.findAll()
		.then(function(usuarios){
			
			res.render("listadoUsuarios", {usuarios:usuarios}) 
	})
	},
	guardado: function (req, res) {
		db.Usuarios.create({
			//nombre de las columnas de las bases de dato(ingles)
			//nombres req.body.(name del formulario)
			fullname: req.body.fullname,
			mail: req.body.mail,
			pais: req.body.pais,
			pass: req.body.pass
			//avatar: req.body.avatar
		});
		res.redirect("/user/usuarios/listado");
	},
	detalle: function (req, res) {
		//ByPk sale del id de la url
		db.Usuarios.findByPk(req.params.id, {
			//los nombres son de las relaciones (as)
			include: [{association: "carrito"}]
		})
			.then(function(usuario){
				res.render('detalleUsuarios', {usuario:usuario});
			})
		},
		editar: function (req, res) {
			//toma el id del url
		let pedidoUsuario = db.Usuarios.findByPk(req.params.id);
//			let pedidoTalle = db.Talle.findAll();
	        Promise.all([pedidoUsuario])
//			.then(function([producto, talle]) {
			.then(function(usuario) {
				res.render('editarUsuario', {usuario:usuario});
			})
		},
		actualizar: function (req, res) {
			db.Usuarios.update({
				//nombre de (izquiera)las columnas de las bases de dato(ingles)
				//nombres req.body.(name del formulario)
			fullname: req.body.fullname,
			pais: req.body.pais,
			mail: req.body.mail,
			pass: req.body.pass
			//FALTA AVATAR
			}, {
			where: {
				id: req.params.id
			}
			});
	
			res.redirect('/usuarios/' + req.params.id)
		},
		borrar: function(req, res) {
			db.Usuarios.destroy({
				where: {
					id: req.params.id
				}
			})
			res.redirect('/listadoUsuarios');
		},


		//MUESTRA LA VISTA DE LOGIN
		loginSQL: function (req, res) {
			res.render("loginSQL");
		  },
		
		  //PROCESA EL LOGIN DE USUARIO
		  procesarLoginSQL: function (req, res) {
			//VALIDACION BACKEND
			const resultValidation = validationResult(req);
		
			if (resultValidation.errors.length > 0) {
			  return res.render("loginSQL", {
				errors: resultValidation.mapped(),
				oldData: req.body,
			  });
			}
		
			//sequelize ENCONTRAR USUARIO POR MAIL
			db.Usuarios.findOne({
			  where: { email: req.body.email },
			})
			  .then((encontrado) => {
				//VALIDACION DEL MAIL CONTRA LA BASE
				if (encontrado == null) {
				  let mensajeError = "El mail no está registrado";
				  res.render("users/login", { mensajeError });
				} else if (
				  encontrado.id_usuario != undefined &&
				  bcrypt.compareSync(req.body.password, encontrado.password)
				) {
				  //LOGUEO EXITOSO
				  req.session.usuarioLogueado = encontrado;
				  // (si el checkbox de recordar usuario no está tildado, debería llegar como "undefined")
				  if (req.body.recordarClave != undefined) {
					res.cookie('recordame',
					encontrado.id_usuario,
					{maxAge:6000000})
				  }
				  res.redirect("/");
				} else {
				  // LOGUEO ERRONEO
				  let mensajeError = "Usuario o clave incorrectos ";
				  res.render("users/login", { mensajeError });
				}
			  })
			  .catch((error) => res.send(error));
		  },
}

module.exports = controller;