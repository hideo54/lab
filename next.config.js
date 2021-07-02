module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                options.defaultLoaders.babel,
                '@svgr/webpack',
            ],
        });
        return config
    },
};
