import bcrypt from 'bcryptjs';

export const users = [
  {
    firstName: 'Admin',
    lastName: 'Head',
    email: 'dayvyno@gmail.com',
    password: bcrypt.hashSync('Shoppinz123', 10),
    isAdmin: true
  },
  {
    firstName: 'user1',
    lastName: 'Random',
    email: 'user1@gmail.com',
    password: bcrypt.hashSync('Shoppinz123', 10),
    isAdmin: false
  }
]