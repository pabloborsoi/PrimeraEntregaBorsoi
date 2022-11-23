module.exports = (sequelize, DataTypes) => {

    const Productos = sequelize.define("Productos", {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        id_marca: {
            type: DataTypes.INTEGER
        },
        id_talle: {
            type: DataTypes.INTEGER
        },
        id_categoria: {
            type: DataTypes.INTEGER
        },
        imagen: {
            type: DataTypes.STRING(40)
        },
        precio: {
            type: DataTypes.INTEGER
        },
        
    }, 
    {
        tableName: "productos",
        timestamps: false,   
        });


    
    Productos.associate = function (models) {
        /*Productos.belongsToMany(models.Carrito, {
            as: "carrito",
            foreignKey: "id_producto"
        })*/

        Productos.belongsTo(models.Marca,{
            as: "marca",
            foreignKey: "id_marca"
        })

        Productos.belongsTo(models.Talle,{
            as: "talle",
            foreignKey: "id_talle"
        })

        Productos.belongsTo(models.Categoria,{
            as: "categoria",
            foreignKey: "id_categoria"
        })
    }



    return Productos
}
