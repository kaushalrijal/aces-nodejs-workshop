const jwt = require("jsonwebtoken");
const { findById } = require("../model/blogModel");
const User = require("../model/userModel");
const promisify = require("util").promisify;

const isAuthenticated = (req, res, next) => {
  token = req.cookies.token;
  
  if (!token || token == null) {
    return res.send("Please login");
  }
//   jwt.verify(promisify((token, process.env.SECRET)));
  jwt.verify(token, process.env.SECRET, async (err, result)=>{
      if(err){
          res.send("Invalid token")
      } else {
          console.log("Valid token", result)
          const data = await User.findById(result.userId);
            if(!data){
                res.send("Invalid User ID in the token")
            } else {
                req.userId = result.userId
                next()
            }
      }
  })
};

module.exports = isAuthenticated;
