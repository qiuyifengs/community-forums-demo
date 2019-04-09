var jwt =  require ( 'jsonwebtoken');
let config  = require ('./token.config');
let userId = '1111'
let authToken = jwt.sign({ userId, exp: (Date.now() / 1000) + (60*2) }, config.session.secrets);
console.log(authToken);


 