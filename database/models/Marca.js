module.exports = (sequelize, DataTypes) => {

    const Marca = sequelize.define("Marca", {
        id_marca: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        nombre_marca: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
    }, 
    {
        tableName: "marca",
        timestamps: false,   
        });


    
        Marca.associate = function (models) {
            Marca.hasMany(models.Productos, {
                as: "productos",
                foreignKey: "id_marca"
            })
        } 


    return Marca
}
