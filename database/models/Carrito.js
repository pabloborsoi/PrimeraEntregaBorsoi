module.exports = (sequelize, DataTypes) => {

    const Carrito = sequelize.define("Carrito", {
        id_carrito: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        id_usuario: {
            type: DataTypes.INTEGER
        },
        id_producto: {
            type: DataTypes.INTEGER
        },
        qty_productos: {
            type: DataTypes.INTEGER
        },
    }, 
    {
        tableName: "carrito",
        timestamps: false,   
        });


    
    Carrito.associate = function (models) {
        Carrito.hasMany(models.Usuarios, {
            as: "usuarios",
            foreignKey: "id_usuario"
        })

        /* Carrito.belongsToMany(models.Productos,{
            as:"productos",
            foreignKey: "id_producto"
        })*/
    }


    return Carrito
}
