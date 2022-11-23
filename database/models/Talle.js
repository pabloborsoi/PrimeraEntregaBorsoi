module.exports = (sequelize, DataTypes) => {

    const Talle = sequelize.define("Talle", {
        id_talle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncremenct: true,
            
        }, 
        nombre_talle: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
    }, 
    {
        tableName: "talle",
        timestamps: false,   
        });

        Talle.associate = function (models) {
            Talle.hasMany(models.Productos, {
                as: "productos",
                foreignKey: "id_talle"
            })
        } 

    return Talle
}
