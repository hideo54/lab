module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{
                loader: '@svgr/webpack',
                options: {
                    svgoConfig: {
                        plugins: [{
                            cleanupIDs: false,
                        }],
                    },
                },
            }],
        });
        return config;
    },
};
