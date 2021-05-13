import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Class representing the Authentication methods
 * @class Authentication
 * @description Authentication class methods
 */
class Authentication {
  /**
   * creates a user token
   * @param {object} payload - contains id, role username and hashedPassword
   * @param {integer} expiresIn - Time in seconds
   * @returns {string} - returns a jwt token
   */
  static async getToken(payload, expiresIn = '24h') {
    const token = jwt.sign({
      id: payload.id,
      username: payload.username,
    }, process.env.JWT_SECRET, {
      expiresIn
    });
    return token;
  }

  /**
   * verify a token's validity
   * @param {string} token - token input
   * @returns {req} - populate the request with the decrypted content
   */
  static async verifyToken(token) {
    let output = {};
    return jwt.verify(
      token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if (err.message === 'jwt expired') {
            output = { error: 'jwt expired', success: false, };
            return output;
          }
          output = {
            Error: 'Failed to authenticate token',
            success: false
          };
        } else {
          output = {
            success: true,
            id: decoded.id,
            username: decoded.username,
          };
        }
        return output;
      }
    );
  }
}

export default Authentication;
