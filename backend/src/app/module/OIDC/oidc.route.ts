import express from 'express';
import oidcController from './oidc.controller.js';

const router = express.Router();

router.get(
    '/.well-known/openid-configuration',
    oidcController.serviceDiscovery,
);

router.get('/.well-known/jwks.json', oidcController.jwks);

router.get('/o/authenticate', oidcController.authenticate);

router.post('/o/authenticate/signin', oidcController.signin);

router.post('/o/authenticate/signup', oidcController.signup);

router.get('/o/authenticate/signout', oidcController.signout);

router.post('/o/token', oidcController.token);

router.get('/o/userinfo', oidcController.userInfo);

export default router;
