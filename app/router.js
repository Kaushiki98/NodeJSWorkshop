/************************************************************************************
 * @purpose   : Used to provide user routes to web pages. 
 * @file      : router.js
 *************************************************************************************/

var express = require('express');
var router = express.Router();
const user = require('./controller');

// post method to create new user
router.post("/userRegistration", user.createUser);

// post method to login user
router.post("/userLogin", user.loginUser);

//get method to generate tokens 
router.get("/token", user.token);

// put method to upload file
router.put("/uploadImg", user.uploadImg);

// get method to search the key
router.get('/searchKey', user.SearchKey)

// get method to get the keys
router.get('/selectKey', user.selectKey)

//get method to get the data in the page
router.get('/page', user.paginated);

module.exports = router ;
