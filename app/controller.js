// @purpose   : creats user schema and stores data in database.
const UserModel = require('./model');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const ACCESS_JWT_ACTIVATE = "secret123"
const bcrypt = require('bcrypt')
const multer = require('multer');
const uploads = multer({ dest: 'G:/images1' }) //create folder

// To validate the users input
const RegisterValidation = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required()
});

// To generate tokens
const createToken = (result) => {
  return jwt.sign({ result }, ACCESS_JWT_ACTIVATE, { expiresIn: '1h' });
}

// to image save in local storage system
const storage = multer.diskStorage({
  //copy file in destination
  destination: (req, file, cb) => {
    cb(null, 'G:/images1')
  },
  // copy original file
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image');
// check file type
const checkFileType = (file, cb) => {
  // Allow extention
  const filetypes = /jpeg|jpg|png|gif/;
  // check extention
  const extname = filetypes.test(file.originalname);
  //check mimetype
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!')
  }
}

class userController {

  // @description : To handle register of new user
  createUser = (req, res) => {
    const userRegisteration = {
      userName: req.body.userName,
      password: req.body.password,
    };
    const validation = RegisterValidation.validate(userRegisteration);
    if (validation.error) {
      return res.status(400).send({
        status: 400,
        message: "Please Enter Valid Details"
      });
    }
    else {
      UserModel.createUser(req, res, (err, result) => {
        if (err) {
          console.log("Some error occured while registering user");
          return res.status(500).send({
            status: 500,
            message: "error"
          })
        }
        else {
          console.log("saved registering user");
          return res.status(200).send({
            status: 200,
            message: "saved"
          })
        }
      });
    }
  }

  // @description : To handel login details of user
  loginUser = (req, res) => {
    const userLogin = {
      userName: req.body.userName,
      password: req.body.password
    };
    const validation = RegisterValidation.validate(userLogin);
    if (validation.error) {
      return res.status(400).send({
        status: 400,
        message: "Please Enter Valid Details"
      });
    } else {
      UserModel.loginUser(userLogin, (err, result) => {
        if (result) {
          bcrypt.compare(userLogin.password, result.password, (err, token) => {
            if (token) {
              createToken(token);

              console.log(createToken(token))
              console.log("login success!")
              res.status(200).send({ status: 200, token: createToken(token), message: "Token created successfully" })
            }
            else {
              res.status(500).send({ status: 500, message: "Invalid Details" })
            }
          })
        }
        else {
          res.status(500).send({ status: 500, message: "Error Occured" })
        }
      })
    }
  }

  // @description : To send the tokens through header for authentication 
  token = (req, res) => {
    var token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, ACCESS_JWT_ACTIVATE, (err, result) => {
        if (err) {
          res.status(500).send({ status: 500, message: "expired" })
        } else {
          res.status(200).send({ status: 200, message: result })
        }
      });
    }
  }

  // @description : To upload the Images
  uploadImg = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.send({ status: 500, message: "not saved" })
      } else {
        res.send({ status: 200, message: "File saved" })
      }
    })
  }

  // @description : To search the user given in the key value
  SearchKey = (req, res) => {
    const searchUser = {
      userName: req.query.userName
    };
    UserModel.searchKey(searchUser, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        let isValid = true;
        for (searchUser.userName in results) {
          isValid = isValid && searchUser[searchUser.userName] == results[searchUser.userName];
        }
        res.send(results);
      }
    })
  }

  // @description : to get the selected keys
  selectKey = (req, res) => {
    UserModel.searchKey(req, res, (err, data) => {
      if (data) {
        res.status(200).send({ data })
      } else {
        res.status(500).send(err)
      }
    })
  }

  // @description : To upload the Images
  paginated = (req, res) => {
    UserModel.searchKey(req, res, (err, results) => {
      if (results) {
        const pageLimit = {
          page: parseInt(req.query.page),
          limit: parseInt(req.query.limit)
        };
        const perPage = 5
        var startIndex = (pageLimit.page - 1) * perPage;

        const limit = pageLimit.limit;
        const endIndex = startIndex + limit;

        const users = [];

        while (startIndex < endIndex) {
          console.log(results[startIndex])
          users.push(results[startIndex]);
          startIndex++;
        }
        res.send(users);

      } else {
        console.log(err)
        res.status(500).json({ message: e.message })
      }
    })
  }
}

module.exports = new userController()