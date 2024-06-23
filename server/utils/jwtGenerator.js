const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config({ path: 'D:/Capstone-Project/GetFit/Server/.env' });

function jwtGenerator(user_id, user_username) {
  const payload = {
    user: {
      id: user_id,
      username: user_username
    }
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr'})
}

module.exports = jwtGenerator;