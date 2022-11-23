module.exports = (sequelize, DataTypes) => {

    const Usuarios = sequelize.define("Usuarios", {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        mail: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        pais: {
            type: DataTypes.STRING(40)
        },
        fullname: {
            type: DataTypes.STRING(40)
        },
        avatar: {
            type: DataTypes.STRING(40)
        },
        pass:{
            type: DataTypes.STRING(40)
        }
    }, 
    {
        tableName: "usuarios",
        timestamps: false,   
        });

    Usuarios.associate = function (models) {
        Usuarios.belongsTo(models.Carrito, {
            as: "carrito",
            foreignKey: "id_usuario"
        })
    }

    return Usuarios
}
