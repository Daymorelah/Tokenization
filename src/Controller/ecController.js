import {
  generateKey, readKey, encrypt, createMessage, readMessage, decrypt,
} from 'openpgp';
import { HelperMethods, Authentication, } from '../../utils';

let privateKey, publicKey;

/**
 * Class representing the Elliptic Curve controller
 * @class ECController
 * @description ECController
 */
class ECController {
  static async encryptToken(req, res) {
    try {
      // Get user supplied data, password, name, and email from the request body.
      const {
        name, email, data, password,
      } = req.body;
      // Generate both private and public keys using RSA of 2K bits
      const { privateKeyArmored, publicKeyArmored, } = await generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ name, email, }],
        password,
      });
      // Read and convert armoured key to key object
      publicKey = await readKey({ armoredKey: publicKeyArmored });
      privateKey = await readKey({ armoredKey: privateKeyArmored });
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
          message: 'Token encrypted with Elliptic curve successfully',
          encryptedToken,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ success: false, message: 'Could not encrypt the token. Please, try again.' });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }

  static async decryptToken(req, res) {
    try {
      const { encryptedToken, } = req.body;
      // Reads encrypted armoured token and returns a message object
      const messageObject = await readMessage({ armoredMessage: encryptedToken, });
      const { data: decrypted, } = await decrypt({
        message: messageObject, publicKeys: publicKey, privateKeys: privateKey,
      });
      const decipheredToken = decrypted;
      // verify the validity of the token
      const token = await Authentication.verifyToken(decipheredToken);
      if (token.success) {
        // Send response to the client
        return res.status(200).json({
          success: true,
          message: 'Token decrypted successfully',
          token,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ ...token, });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }
}

export default ECController;
