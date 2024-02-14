import jwt from 'jsonwebtoken';

function generateToken(res, userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  //Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 //1 day
  })
}

export default generateToken;