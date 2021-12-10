module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{
                loader: '@svgr/webpack',
                options: {
                    ref: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'cleanupIDs',
                                active: false,
                            },
                            {
                                name: 'prefixIds',
                                active: true,
                            },
                        ],
                    },
                },
            }],
        });
        return config;
    },
};
