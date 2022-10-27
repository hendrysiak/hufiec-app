module.exports = function override(config, env) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        stream: require.resolve("stream-browserify"),
        zlib: require.resolve('browserify-zlib'),  
        assert: require.resolve('assert-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
      });
      config.resolve.fallback = fallback;

    return config;
  }