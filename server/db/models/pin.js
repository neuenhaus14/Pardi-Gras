const dotenv = require('dotenv');

dotenv.config();

const PIN_TYPES = process.env.PIN_TYPES;
const PIN_TYPES_ARRAY = PIN_TYPES.split(' ');

module.exports = (sequelize, Sequelize) => {
  // console.log('PIN!');
  const Pin = sequelize.define('pin', {
    pinType: {
      type: Sequelize.ENUM(...PIN_TYPES_ARRAY),
      allowNull: false,
    },
    photoURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    latitude: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    longitude: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
  });

  Pin.associate = function (models) {
    // Pin.hasOne(models.content, {
    //   foreignKey : {
    //     name: 'pinId',
    //   },
    // });
    // NOT SURE IF THIS IS NEEDED
    // Pin.Content = Pin.belongsTo(models.content)

    Pin.hasOne(models.content, {
      foreignKey: 'contentableId',
      constraints: false,
      scope: {
        contentableType: 'pin',
      },
    });
  };
  return Pin;
};

// Join_shared_post.belongsTo(User, {
//   as: 'senderUserId',
//   foreignKey: {
//     name: 'sender_userId',
//   },
// });

// User.hasMany(Join_shared_post
// , {
// //   //as: 'senderUserId',
//   foreignKey: {
//     name: 'sender_userId',
//   },
// });
