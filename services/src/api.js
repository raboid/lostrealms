// import { hashSync, compareSync } from 'bcryptjs';
// import { sign, verify }          from 'jsonwebtoken';
// import moment                    from 'moment';

// const unprotectedRoutes = ['/login', '/register'];

// export function authMiddleware(req, res, next) {
//   if(unprotectedRoutes.indexOf(req.path) > -1) {
//     return next();
//   }
//   let token = null;
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.query && req.query.token) {
//     token = req.query.token;
//   }
//   if (token) {
//     // verifies secret and checks exp
//     verify(token, 'secret', (err, user) => {
//      if (err) {
//        return res.status(401).json({ error: 'Failed to authenticate token.' });
//      } else {
//        req.user = user;
//        return next();
//      }
//     });
//   } else {
//      // if there is no token
//      // return an error
//      return res.status(403).send({
//          success: false,
//          message: 'No token provided.'
//      });
//    }
// }

// export function handleLogin(req,res) {
//   const { email, password } = req.body;
//   DB.findUserByEmail(email, (err, user) => {
//     if(err || !user) {
//       res.status(401).json({ error: 'bad login' });
//       return;
//     }
//     if(compareSync(password, user.password)) {
//       const token = signToken(user);
//       res.status(200).json({ token });
//       return;
//     }
//     res.status(401).json({ error: 'bad login' });
//   });
// }

// export function handleRegister(req,res) {
//   const { email, password, password_confirmation } = req.body;
//   if (!validateEmail(email)) {
//     res.status(400).json({ error: 'Invalid email address' });
//     return;
//   }
//   if (password !== password_confirmation) {
//     res.status(400).json({ error: 'Passwords do not match' });
//     return;
//   }
//   const user = {
//     id: uuid.v4(),
//     email,
//     settings: {
//       keybindings: {
//         game: {
//           moveLeft: 'a',
//           moveRight: 'd',
//           moveUp: 'w',
//           moveDown: 's'
//         },
//         ui: {
//           toggleMenu: 'Escape',
//           toggleChat: 'c',
//           toggleInventory: 'i',
//           toggleEquipment: 'e'
//         }
//       }
//     },
//     password: hashSync(password, 8),
//     createdAt: moment().toString()
//   };
//   DB.saveUser(user, (err, user) => {
//     if(err || !user) {
//       res.status(400).json({ error: err });
//     } else {
//       const token = signToken(user);
//       res.status(201).json({ token });
//     }
//   });
// }

// export function handleGetPlayers(req, res) {
//   DB.findPlayers(req.user.id, (err, players) => {
//     if(err) {
//       res.status(400).json({ error: err });
//     } else if(!players){
//       res.status(400).json({ error: 'failure' });
//     } else {
//       console.log('got players', players);
//       res.status(200).json(players);
//     }
//   });
// }

// export function handleCreatePlayer(req, res) {
//   const { name } = req.body;
//   // get user from jwt in header using parser
//   if (!validateName(name)) {
//     res.status(400).json({ error: 'Name already taken' });
//     return;
//   }
//   const player = {
//     id: uuid.v4(),
//     userId: req.user.id,
//     name,
//     inventory: {
//       0: { name: 'Dagger' },
//       1: { name: 'Gold Helmet' }
//     },
//     equipment: {
//       main: null,
//       alt: null,
//       armor: null
//     },
//     position: [5,5],
//     health: 100,
//     createdAt: moment().toString()
//   };
//   DB.savePlayer(player, (err, result) => {
//     if(err) {
//       res.status(400).json({ error: err });
//     } else if(!result){
//       res.status(400).json({ error: 'failure saving player' });
//     }
//     else {
//       res.status(201).json(player);
//     }
//   });
// }

// export function handleGetMap(req, res) {
//   const map = { blocks: ['block'] };
//   res.status(200).json(map);
// }

// /*function createPlayer(user, {name}) {
//   const player = {
//     user_id: user.id,
//     name,
//     health: 100,
//     power: 100,
//     inventory: [],
//     equipment: [],
//     createdAt: moment().toString()
//   };
//   DB.savePlayer(player, (err, player) => {
//     if(err || !player) {
//     } else {
//     }
//   });
// }*/

// function signToken(user) {
//   return sign(user, 'secret');
// }

// function validateToken(token) {
//   return verify(token, 'secret');
// }

// function handleError(res) {
//   return error => {
//     res.status(500).json({ error: error.message });
//   }
// }

// function validateEmail(email) {
//   // Hot damn this regex is huge
//   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// }

// function validateName(name) {
//   return true;
// }
