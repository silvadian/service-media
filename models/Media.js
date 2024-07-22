module.exports=(sequelize,DataTypes)=>{
    const Media=sequelize.define("Media",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        image:{
            type:DataTypes.STRING,
            allowNull:false
        },
        createdAt:{
            type:DataTypes.DATE,
            allowNull:false,
            field:"created_at"
        },
        updatedAt:{
            type:DataTypes.DATE,
            allowNull:false,
            field:"updated_at"
        }
    })
    return Media
}