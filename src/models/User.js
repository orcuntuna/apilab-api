const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim zorunludur.'],
    minlength: [3, 'İsim en az 3 karakter olabilir.'],
    maxlength: [32, 'İsim en fazla 32 karakter olabilir.'],
  },
  surname: {
    type: String,
    required: [true, 'İsim zorunludur.'],
    minlength: [3, 'İsim en az 3 karakter olabilir.'],
    maxlength: [32, 'İsim en fazla 32 karakter olabilir.'],
  },
  email: {
    type: String,
    unique: [true, 'E-posta adresi zaten kullanılıyor.'],
    required: [true, 'E-posta adresi zorunludur.'],
    maxlength: [64, 'E-posta adresi en fazla 64 karakter olabilir.'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'E-posta adresi geçerli değil.',
    ],
  },
  username: {
    type: String,
    unique: [true, 'Bu kullanıcı adı zaten kullanılıyor.'],
    required: [true, 'Kullanıdı adı zorunludur.'],
    minlength: [3, 'Kullanıcı adı en az 3 karakter olabilir.'],
    maxlength: [32, 'Kullanıcı adı en fazla 32 karakter olabilir.'],
    match: [
      /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
      'Kullanıcı adı geçerli değil.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Parola zorunludur.'],
  },
  token: {
    type: String,
  },
  rank: {
    type: String,
    enum: {
      values: ['standart', 'premium'],
      message: 'Proje tipi geçerli değil.',
    },
    default: 'standart',
    lowercase: true,
  },
})

schema.plugin(uniqueValidator, { message: 'Bu {PATH} zaten mevcut.' })
module.exports = mongoose.model('User', schema)
