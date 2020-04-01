const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Proje ismi zorunludur.'],
    minlength: [2, 'Proje ismi en az 2 karakter olabilir.'],
    maxlength: [64, 'Proje ismi en fazla 64 karakter olabilir.'],
    match: [
      /^[a-z0-9_-]{3,64}$/,
      'Proje ismi  geçerli değil.',
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proje sahibi mevcut değil.'],
  },
  type: {
    type: String,
    required: [true, 'Proje tipi mevcut değil.'],
    enum: {
      values: ['public', 'private'],
      message: 'Proje tipi geçerli değil.',
    },
    default: 'public',
  },
  description: {
    type: String,
    maxlength: [300, 'Açıklama en fazla 300 karater olabilir'],
  },
  categories: [
    {
      name: {
        type: String,
        required: [true, 'Kategori ismi zorunludur.'],
        minlength: [3, 'Kategori ismi en az 3 karakter olabilir.'],
        maxlength: [64, 'Kategori ismi en fazla 64 karakter olabilir'],
      },
      order: {
        type: Number,
        default: 0,
        min: [0, 'Sıra en az 0 olabilir.'],
      },
    },
  ],
})

module.exports = mongoose.model('Project', schema)
