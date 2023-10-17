module.exports = {
    webpack: config => {
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
                                params: {
                                    remove: false,
                                },
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
