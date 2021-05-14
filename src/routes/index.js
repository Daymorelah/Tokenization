import { AESController, Chacha20Controller, RSAController, } from '../Controller/index';

/**
 * Handles request
 * @param {object} app - An instance of the express module
 * @returns {object} - An object containing all routes
 */
const routes = app => {
  app.get('/', (req, res) => res.redirect('/api/v1/'));
  app.get('/api/v1/', (req, res) => {
    res.status(200).send({
      success: true,
      message: 'Welcome to the API'
    });
  });
  app.post(
    '/api/v1/aes_encrypt',
    AESController.encryptToken,
  );
  app.post(
    '/api/v1/aes_decrypt',
    AESController.decryptToken,
  );
  app.post(
    '/api/v1/chacha20_encrypt',
    Chacha20Controller.encrypt,
  );
  app.post(
    '/api/v1/chacha20_decrypt',
    Chacha20Controller.decrypt,
  );
  app.post(
    '/api/v1/rsa_encrypt',
    RSAController.encryptToken,
  );
};

export default routes;
