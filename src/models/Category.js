const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori ismi zorunludur.'],
    minlength: [3, 'Kategori ismi en az 3 karakter olabilir.'],
    maxlength: [64, 'Kategori ismi en fazla 64 karakter olabilir'],
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Proje mevcut değil.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proje sahibi mevcut değil.'],
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Sıra en az 0 olabilir.'],
  },
  apis_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Api',
    },
  ],
})

module.exports = mongoose.model('Category', schema)
