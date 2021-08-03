// @purpose   : creates user schema and stores data in database.

const mongoose = require('mongoose');

//create instance of schema
const mongoSchema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new mongoSchema({
  userName: { type: String, require: true },
  password: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const dbuserschema = mongoose.Schema(userSchema);
const UserModel = mongoose.model('user', dbuserschema);

function hash(password) {
  var salt = bcrypt.genSaltSync(10);
  var hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

class user {

  // @description : To register new user to the database.
  createUser = (req, res) => {
    const newUser = new UserModel({
      userName: req.body.userName,
      password: hash(req.body.password),
    });
    newUser.save((err, data) => {
      if (data) {
        return res.status(200).send({ message: "User successfully registered" })
      } else {
        return res.status(500).send({ message: "Enter valid Details" })
      }
    })
  }

  // @description : To login new user into the database.
  loginUser = (userLogin, callback) => {
    UserModel.findOne({ userName: userLogin.userName }, callback)
  }
  
  searchKey = (req, res, callback) => {
    UserModel.find(callback)
  }

  usersList = (users, callback) => {
    UserModel.find({ userName: users.userName }, callback)
  }
}

module.exports = new user()