import { Router } from 'express';
import { authenticate, ensureAuthenticated } from './controllers/auth';
const router = Router();

router.post('/authenticate', authenticate);

router.get('/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
});

router.get('/setup', (req, res) => {
  const nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
  });

  nick.save(err => {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  })
})

router.get('/ping', (req, res) => {
  res.send('pong');
});

export default router;
