(function () {
    window.pspx = {
        init: function ({ spaceid, isPreview, env = 'production' }) {
            if (!spaceid) {
                throw new Error('missing space id');
            }

            const urlBaseMap = {
                production:
                    'https://fjsu16onvd.execute-api.us-east-1.amazonaws.com/production/api/',
                stage: 'https://4mxwytmbdh.execute-api.us-east-1.amazonaws.com/dev/api/',
                dev: 'http://localhost:5000/api/',
            };

            const url = urlBaseMap[env] ?? urlBaseMap.dev;

            window
                .fetch(
                    url +
                        'styles/getconfig?spaceid=' +
                        spaceid +
                        '&isPreview=' +
                        isPreview
                )
                .then((response) => response.json())
                .then((data) => {
                    let myStringOfstyles = '';

                    if (
                        Array.isArray(data.styleConfig.styles) &&
                        data.styleConfig.styles.length
                    ) {
                        data.styleConfig.styles.forEach((rule) => {
                            const currentRule = `${rule.element} { ${rule.styles
                                .map((styleStr) => {
                                    return `${styleStr} !important; `;
                                })
                                .join(' ')} } `;

                            if (rule.maxWidth || rule.minWidth) {
                                const screenSizeRule = rule.maxWidth
                                    ? 'max-width'
                                    : 'min-width';
                                myStringOfstyles += `@media only screen and (${screenSizeRule}: ${
                                    rule.minWidth || rule.maxWidth
                                }px) {
                                    ${currentRule}
                                }`;
                            } else {
                                myStringOfstyles += currentRule;
                            }
                        });
                    }

                    const head =
                            document.head ||
                            document.getElementsByTagName('head')[0],
                        style = document.createElement('style');

                    head.appendChild(style);
                    style.type = 'text/css';
                    style.appendChild(
                        document.createTextNode(myStringOfstyles)
                    );
                })
                .catch((err) => {
                    throw new Error('pspx failed to load');
                });
        },
    };
})();
