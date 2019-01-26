module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },

        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        posted_by: {
            type: DataTypes.STRING,
            allowNull: false
        },

        votes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })

    return Image;
}