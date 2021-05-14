import {
  generateKey, readKey, encrypt, createMessage,
} from 'openpgp';
import { HelperMethods, Authentication, } from '../../utils';

/**
 * Class representing the RSA controller
 * @class RASController
 * @description RSAController
 */
class RSAController {
  static async encryptToken(req, res) {
    try {
      // Get user supplied data, password, name, and email from the request body.
      const {
        name, email, data, password,
      } = req.body;
      // Generate both private and public keys using RSA of 2K bits
      const { privateKeyArmored, publicKeyArmored, } = await generateKey({
        type: 'rsa',
        rsaBits: 2048,
        userIDs: [{ name, email, }],
        password,
      });
      // Read and convert armoured key to key object
      const publicKey = await readKey({ armoredKey: publicKeyArmored });
      const privateKey = await readKey({ armoredKey: privateKeyArmored });
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.getToken({ ...data, });
      // Encrypt JWT token with the public key and sign the JWT token with the private key.
      const encryptedToken = await encrypt({
        message: await createMessage({ text: tokenCreated, }),
        publicKeys: publicKey,
        privateKeys: privateKey,
      });
      if (encryptedToken) {
        // Send response to the client or whoever used our API
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
}

export default RSAController;
