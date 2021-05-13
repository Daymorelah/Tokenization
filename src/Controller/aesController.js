import {
  createHash, createCipheriv, pseudoRandomBytes,
} from 'crypto';
import { HelperMethods, Authentication, } from '../../utils';

/**
 * Class representing the AES-256 controller
 * @class aesController
 * @description AES-256 controller
 */
class aesController {
  static async encryptToken(req, res) {
    try {
      // Get user supplied data and password from the request body.
      const { data, password } = req.body;
      // Generate token from user-supplied data.
      const tokenCreated = await Authentication.getToken({ ...data, });
      // Hash the password and git output in Hex format
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      // Ensure the key length is compatible with the algorithm chosen, i.e aes-256. The key length should be 32.
      const generatedKey = Buffer.alloc(32, hashedPassword, 'hex');
      // Generate pseudorandom IV. Its length must be 16 bytes.
      const initializationVector = Buffer.alloc(16, pseudoRandomBytes(16));
      // Create a cipher text with the aes-256-cbc algorithm.
      const cypherText = createCipheriv('aes-256-cbc', generatedKey, initializationVector);
      // Encrypt the data and output in base64 format.
      let encryptedData = cypherText.update(tokenCreated, 'utf-8', 'base64');
      encryptedData += cypherText.final('base64');
      // Send response to the client or whoever used our API
      return res.status(200).json({
        success: true,
        message: 'Data encrypted successfully',
        encryptedData,
      });
    } catch (e) {
      console.log('error is ==> ', e);
      return HelperMethods.serverError(res);
    }
  }
}

export default aesController;
