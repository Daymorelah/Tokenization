import { createHash, pseudoRandomBytes, } from 'crypto';
import { encrypt, decrypt, } from 'chacha20';
import { HelperMethods, Authentication, } from '../../utils';

let generatedKey = '', randomSeed = '';

/**
 * Class representing the Chacha20 controller
 * @class Chacha20Controller
 * @description Chacha20 controller
 */
class Chacha20Controller {
  static async setKeyAndRandomSeed(password) {
    // Hash the password and get output in binary format
    const getKey = createHash('sha256').update(password).digest('binary');
    // Generate a 16 byte random binary digit or nonce
    const generateRandomSeed = Buffer.alloc(16, pseudoRandomBytes(16));
    generatedKey = getKey;
    randomSeed = generateRandomSeed;
  }

  static async encrypt(req, res) {
    try {
      // Get user supplied data and password from the request body.
      const { data, password } = req.body;
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.getToken({ ...data, });
      // Convert teh token from string to a binary format.
      const convertTokenToBinary = new Buffer.from(tokenCreated);
      // Set the random seed, or nonce, and key in binary format
      Chacha20Controller.setKeyAndRandomSeed(password);
      // Encrypt the token, in binary format, using chacha20 passing the key and random seed/nonce.
      const encryptedToken = encrypt(generatedKey, randomSeed, convertTokenToBinary).toString('hex');
      if (encryptedToken) {
        return res.status(200).json({
          success: true,
          message: 'Token encrypted successfully',
          encryptedToken,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ success: false, message: 'Could not encrypt the token. Please, try again.' });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }

  static async decrypt(req, res) {
    try {
      // Get user supplied data and password from the request body.
      const { encryptedToken, } = req.body;
      // Convert the encrypted token back to binary first
      const encryptedTokenToBinary = Buffer.from(encryptedToken, 'hex');
      // Decrypt the encrypted token sing chacha20, passing the key and random seed/nonce
      const decryptedText = decrypt(generatedKey, randomSeed, encryptedTokenToBinary);
      // Convert the output of the decryption process to string
      const decryptedToken = decryptedText.toString();
      // verify the validity of the token
      const token = await Authentication.verifyToken(decryptedToken);
      // Send response to the client
      if (token.success) {
        return res.status(200).json({
          success: true,
          message: 'Token decrypted successfully',
          token,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ token, });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }
}

export default Chacha20Controller;
