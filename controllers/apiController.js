// IMPORTANDO MODULOS
const db = require("../database/models");
const Op = db.Sequelize.Op;

//METODOS DE LA API
const apiController = {

  listarUsuarios: function (req, res) {
    db.Usuarios.findAll({
      attributes: {
        exclude: ["pass", "mail", "pais", "avatar"],
      },
    })
      .then((usuarios) => {
        usuarios.forEach((usuario) => {
          usuario.dataValues.detail = `http://localhost:4000/api/usuarios/${usuario.id_usuario}`;
        });
        return res.json({
          total_usuarios: usuarios.length,
          usuarios: usuarios,
        });
      })
      .catch((error) => res.send(error));
  },
  detalleUsuario: function (req, res) {
    db.Usuarios.findByPk(req.params.id, {
      attributes: { exclude: ["pass"] },
    })
      .then((usuario) => {
        usuario.dataValues.urlFoto = `http://localhost:4000/images/avatars/${usuario.avatar}`;
        return res.json({
          datos: usuario,
        });
      })
      .catch((error) => res.send(error));
  },
  listarProductos:function (req, res) {
    db.Productos.findAll({
      attributes: {
        exclude: ["id_marca", "id_talle", "id_categoria", "precio", "imagen"],
      },
    })
      .then((productos) => {
        productos.forEach((producto) => {
          producto.dataValues.detail = `http://localhost:4000/api/productos/${producto.id_producto}`;
        });
        return res.json({
          total_productos: productos.length,
          productos: productos,
        });
      })
      .catch((error) => res.send(error));
    },
  detalleProducto: function (req, res) {
    db.Productos.findByPk(req.params.id)
      .then((producto) => {
        producto.dataValues.urlFoto = `http://localhost:4000/images/camisetas/${producto.imagen}`;
        //producto.dataValues.urlFoto = `${producto.imagen}`;
        return res.json({
          datos: producto,
        });
      })
      .catch((error) => res.send(error));
  },

  listarMarcas: function (req, res) {
    db.Marca.findAll()
      .then((marca) => {
        marca.forEach((marca) => {
          marca.dataValues.detail = `http://localhost:4000/api/marcas/${marca.id_marca}`;
        });
        return res.json({
          total_marcas: marca.length,
          marca: marca,
        });
      })
      .catch((error) => res.send(error));
  }

};
module.exports = apiController;