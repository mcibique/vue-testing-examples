module.exports = {
  presets: [
    ['@vue/app', { jsx: false, loose: true }]
  ],
  'env': {
    'test': {
      'plugins': [
        'istanbul'
      ]
    }
  }
};
