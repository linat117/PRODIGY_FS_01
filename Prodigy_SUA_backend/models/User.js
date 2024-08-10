const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

// Middleware to hash the password before saving the user
userSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  } else {
    return next();
  }
});

// Method to compare the password for authentication
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
