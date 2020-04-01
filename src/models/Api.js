const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'API ismi zorunludur.'],
    minlength: [2, 'API ismi en az 2 karakter olabilir.'],
    maxlength: [128, 'API ismi en fazla 128 karakter olabilir.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proje sahibi mevcut değil.'],
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Proje mevcut değil.'],
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Kategori mevcut değil.'],
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Sıra en az 0 olabilir.'],
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    default: '/',
    maxlength: [128, 'URL en fazla 128 karakter olabilir.'],
  },
  method: {
    type: String,
    required: true,
    enum: {
      values: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'HEAD',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH',
      ],
      message: 'Metod tipi geçerli değil.',
    },
    default: 'GET',
  },
  header_params: [
    {
      key: {
        type: String,
        required: [true, 'Header paremetresi için key zorunludur.'],
      },
      value: {
        type: String,
        required: [true, 'Header parametresi için value zorunludur.'],
      },
      type: {
        type: String,
        enum: {
          values: ['optional', 'required'],
          message: 'Paremetre tipi geçerli değil.',
        },
        default: 'optional',
      },
    },
  ],
  url_params: [
    {
      key: {
        type: String,
        required: [true, 'URL paremetresi için key zorunludur.'],
      },
      value: {
        type: String,
        required: [true, 'URL parametresi için value zorunludur.'],
      },
      type: {
        type: String,
        enum: {
          values: ['optional', 'required'],
          message: 'Paremetre tipi geçerli değil.',
        },
        default: 'optional',
      },
    },
  ],
  data_params: [
    {
      key: {
        type: String,
        required: [true, 'Data paremetresi için key zorunludur.'],
      },
      value: {
        type: String,
        required: [true, 'Data parametresi için value zorunludur.'],
      },
      type: {
        type: String,
        enum: {
          values: ['optional', 'required'],
          message: 'Paremetre tipi geçerli değil.',
        },
        default: 'optional',
      },
    },
  ],
  responses: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      language: {
        type: String,
      },
      code: {
        type: [Number, 'Response kodu sayı olmalıdır.'],
        required: [true, 'Response kodu zorunludur.'],
        default: 200,
      },
      content: {
        type: String,
      },
    },
  ],
  calls: [
    {
      language: {
        type: String,
        enum: {
          values: [
            'javascript',
            'python',
            'java',
            'ruby',
            'csharp',
            'golang',
            'sh',
            'php',
            'typescript',
            'kotlin',
            'swift',
          ],
          message: 'Çağrı dili geçerli değil.',
        },
        default: 'javascript',
      },
    },
  ],
  notes: [
    {
      type: {
        type: String,
        required: [true, 'Not tipi zorunludur.'],
        enum: {
          values: ['info', 'warning', 'danger'],
          message: 'Not tipi geçerli değil.',
        },
        default: 'info',
      },
      content: {
        type: String,
        required: [true, 'Not açıklaması zorunludur.'],
      },
    },
  ],
})

module.exports = mongoose.model('Api', schema)