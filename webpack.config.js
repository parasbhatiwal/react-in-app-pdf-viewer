module.exports = {
    resolve: {
        fallback: {
            worker_threads: false,
        },
    },
    module: {
        rules: [
            {
                test: /pdf\.worker\.min\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: true,
                    },
                },
            },
        ],
    },
};