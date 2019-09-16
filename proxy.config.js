const proxy = [
    {
      context: '/',
      target: 'http://localhost:4200',
      pathRewrite: { '^/': '' }
    }
  ];
  module.exports = proxy;