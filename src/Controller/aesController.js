import {
  createHash, createCipheriv, createDecipheriv, pseudoRandomBytes,
} from 'crypto';
import { HelperMethods, Authentication, } from '../../utils';

let generatedKey = '', initializationVector = '';

/**
 * Class representing the AES-256 controller
 * @class aesController
 * @description AES-256 controller
 */
class aesController {
  static async setKeyAndIv(hashedPassword) {
    // Ensure the key length is compatible with the algorithm chosen, i.e aes-256. The key length should be 32.
    const getKey = Buffer.alloc(32, hashedPassword, 'hex');
    // Generate pseudorandom IV. Its length must be 16 bytes.
    const getInitializationVector = Buffer.alloc(16, pseudoRandomBytes(16));
    generatedKey = getKey;
    initializationVector = getInitializationVector;
  }

  static async encryptToken(req, res) {
    try {
      // Get user supplied data and password from the request body.
      const { data, password } = req.body;
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.getToken({ ...data, });
      // Hash the password and get output in Hex format
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      // Call class method to set the IV and key
      aesController.setKeyAndIv(hashedPassword);
      // Create a cipher text with the aes-256-cbc algorithm.
      const cypherText = createCipheriv('aes-256-cbc', generatedKey, initializationVector);
      // Encrypt the data and output in base64 format.
      let encryptedToken = cypherText.update(tokenCreated, 'utf-8', 'base64');
      encryptedToken += cypherText.final('base64');
      if (encryptedToken) {
        // Send response to the client or whoever used our API
        return res.status(200).json({
          success: true,
          message: 'Token encrypted successfully',
          encryptedToken,
        });
      }
      return res.status(400).json({ success: false, message: 'Could not encrypt the token. Please, try again.' });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }

  static async decryptToken(req, res) {
    try {
      const { encryptedToken, } = req.body;
      const decipherText = createDecipheriv('aes-256-cbc', generatedKey, initializationVector);
      let decipheredToken = decipherText.update(encryptedToken, 'base64');
      decipheredToken += decipherText.final();
      const token = await Authentication.verifyToken(decipheredToken);
      if (token.success) {
        return res.status(200).json({
          success: true,
          message: 'Token decrypted successfully',
          token,
        });
      }
      return res.status(400).json({ ...token, });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }
}

export default aesController;
