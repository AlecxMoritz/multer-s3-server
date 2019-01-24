module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },

        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Image;
}