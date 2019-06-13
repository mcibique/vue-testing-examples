module.exports = {
  presets: [
    ['@vue/app', { jsx: false, loose: true, useBuiltIns: 'entry' }]
  ],
  'env': {
    'test': {
      'plugins': [
        'istanbul'
      ]
    }
  }
};
