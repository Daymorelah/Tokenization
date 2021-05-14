import { HelperMethods, Authentication, } from '../../utils';

/**
 * Class representing the AES-256 controller
 * @class aesController
 * @description AES-256 controller
 */
class TokenController {
  static async getToken(req, res) {
    try {
      const { payload, } = req.body;
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.getToken({ ...payload, });
      if (tokenCreated) {
      // Send response to the client or whoever used our API
        return res.status(200).json({
          success: true,
          message: 'Token created successfully',
          tokenCreated,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ success: false, message: 'Could not create the token. Please, try again.' });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }

  static async verifyToken(req, res) {
    try {
      const { payload, } = req.body;
      // Generate token from user-supplied data. Remember to set your JWT secret key in the '.env' file.
      const tokenCreated = await Authentication.verifyToken({ ...payload, });
      if (tokenCreated) {
      // Send response to the client or whoever used our API
        return res.status(200).json({
          success: true,
          message: 'Token created successfully',
          tokenCreated,
        });
      }
      // If any thing goes wrong execute the line of code below.
      return res.status(400).json({ success: false, message: 'Could not create the token. Please, try again.' });
    } catch (error) {
      return HelperMethods.serverError(res, error.message);
    }
  }
}

export default TokenController;
