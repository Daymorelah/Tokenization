import { createHash, } from 'crypto';
import { encrypt, } from 'chacha20';
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
    const generateRandomSeed = new Buffer.alloc(8).fill(0);
    generatedKey = getKey;
    randomSeed = generateRandomSeed;
  }

  static async encrypt(req, res) {
    try {
      // Get user supplied data and password from the request body.
      const { data, password } = req.body;
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.getToken({ ...data, });
      const convertTokenToBinary = new Buffer.from(tokenCreated);
      Chacha20Controller.setKeyAndRandomSeed(password);
      const encryptedToken = encrypt(generatedKey, randomSeed, convertTokenToBinary).toString('hex');
      if (encryptedToken) {
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
}

export default Chacha20Controller;
