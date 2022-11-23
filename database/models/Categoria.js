module.exports = (sequelize, DataTypes) => {

    const Categoria = sequelize.define("Categoria", {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        nombre_categoria: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
    }, 
    {
        tableName: "categoria",
        timestamps: false,   
        });

        Categoria.associate = function (models) {
            Categoria.hasMany(models.Productos, {
                as: "productos",
                foreignKey: "id_categoria"
            })
        } 
    return Categoria
}
