import mongoose, { Schema } from 'mongoose';
import names from 'starwars-names';

export default new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, reuireq: true },
  fullName: { type: String, default: names.random },
  photoUrl: { type: String, default: () => `https://github.com/identicons/${new Date().getMilliseconds()}.png` },
  status: { type: String, default: 'online' },
});
