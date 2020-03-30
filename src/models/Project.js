const mongoose = require('mongoose')

const schema = new mognoose.Schema({
  name: {
    type: String,
    required: [true, 'Proje ismi zorunludur.'],
    minlength: [3, 'Proje ismi en az 3 karakter olabilir.'],
    maxlength: [64, 'Proje ismi en fazla 64 karakter olabilir.'],
    match: [
      /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
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
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: [300, 'Açıklama en fazla 300 karater olabilir'],
  },
  categories: [
    {
      _id: {
        type: ObjectId,
      },
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
      apis: [
        {
          _id: {
            type: ObjectId,
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
                ' HEAD',
                'CONNECT',
                'OPTIONS',
                'TRACE',
                'PATCH',
              ],
              message: 'Metod tipi geçerli değil.',
            },
            default: 'GET',
            uppercase: true,
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
                lowercase: true,
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
                lowercase: true,
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
                lowercase: true,
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
              code: {
                type: [Number, 'Response kodu sayı olmalıdır.'],
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
              },
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
              lowercase: true,
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
        },
      ],
    },
  ],
})

module.exports = mongoose.model('Model', schema)