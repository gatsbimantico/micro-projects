function loadScript (src) {

                return new Promise((resolve, reject) => {
                    
                    var script;

                    if (document.querySelector('script[src*="'+src+'.js"]')) {

                        resolve();

                    } else {

                        script = document.createElement('script');
                        script.src = src + '.js';
                        script.async = true;
                        script.onload = () => {
                            resolve();
                        };
                        script.onabort = script.onerror = reject;
                        document.body.appendChild(script);

                    }

                })

            }