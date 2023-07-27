        <template>
            <div class="sdk">
                <Sidebar />
                <div class="content">
                    <div class="mt-4"
                        style="background-color: #f8fafb; height: 80px !important; width: 95%; margin-left: 2rem !important; border-radius: 1rem;">
                        <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;width: 95%;">SDK</label>
                    </div>
                    <!-- Dashboard content goes here -->
                    <div class="d-flex mt-4 justify-content-between py-3 px-4"
                        style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: max-content;">
                        <div class="how-to-use" style="max-width: 650px; margin: 1rem 2rem 0 0;">
                            <h2>How to Use the vueTracker Plugin</h2>
                            <p>
                                To use the <code>vueTracker</code> plugin in your Vue.js application, follow these steps:
                            </p>
                            <ol>
                                <li>Install the required dependencies (js-cookie and uuid) using npm or yarn:</li>
                                <br>
                                <pre><code>     
        npm install js-cookie uuid
                                </code></pre>
                                <li>
                                    Create a file for the plugin, e.g., <code>vueTracker.js</code>, and copy the content of the
                                    <code>vueTracker</code> plugin to it.
                                </li>
                                <br>
                                <li>
                                    Import and install the plugin in your main Vue app file (usually <code>main.js</code>):
                                </li>
                                <br>
                                <pre>
                <code>
        import Vue from 'vue';
        import App from './App.vue';
        import vueTracker from './path/to/tracker'; // Replace with the actual path to your tracker.js file

        Vue.use(vueTracker);

        new Vue({
        render: (h) => h(App),
        }).$mount('#app');
                </code>
                </pre>
                                <li>
                                    Add the <code>async mounted</code> part to your <code>App.vue</code> file:
                                </li>
                                <br>
                                <pre>
                                    <code> 
    export default {
        name: 'App',
        components: {
        },
        async mounted() {
            this.$tracker.detectNewVisitor();

            await this.$tracker.detectSession();

            const intervalDuration = 10 * 60 * 1000;

            this.sessionInterval = setInterval(async () => {
            await this.$tracker.detectSession();
            }, intervalDuration);

            document.addEventListener('click', this.updateLastActivity);
            // document.addEventListener('mousemove', this.updateLastActivity);
            document.addEventListener('keydown', this.updateLastActivity);
        },
    }
                                    </code>
                                </pre>
                                <li>
                                    Now you can create your our event tracker. Here's an example of how to
                                    use the directives to change in the plugin
                                </li>
                                <br>
                                <pre>
                <code>
    const trackerDirectiveForClick = {
        mounted(el, binding) {
            const { value } = binding;
            const { tag } = value;

            el.addEventListener('click', () => {
                let visitorId =  getCookie('visitor_id');
                trackEvent('custom_event',
                    {
                        event_types: 'click',
                        tag_id: tag,
                        tdate: new Date().toLocaleString(),
                        visitor_id: visitorId,
                        session_id: tmp_session_id,
                        app_id: APP_ID,
                    });
            });
        },
    };

    const vueTracker = {
        install(Vue) {
            Vue.directive('tracker-click', trackerDirectiveForClick);
        },
    };
                </code>
                </pre>
                            </ol>
                        </div>
                        <div class="code-container ml-2">
                            <div class="code-header d-flex justify-content-between">
                                <div class="code-header-title">
                                    <h3>vueTracker.js</h3>
                                </div>
                                <div class="code-header-buttons">
                                    <button class="btn btn-primary" @click="copyCode">
                                        <font-awesome-icon icon="copy" />
                                        Copy</button>
                                </div>
                            </div>
                            <pre class="code" :class="{ 'show-full-code': showFullCode }">
                                <code> 
                                    import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const socketUrl = 'http://localhost:8080/api/events';

const APP_ID = 'test';

let tmp_session_id = null;

let pagesVisited = [];

const trackEvent = (eventName, eventData) => {
    fetch(socketUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'App-Id': APP_ID,
        },
        body: JSON.stringify({ eventName, eventData }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch((error) => {
            console.error('Error sending event data:', error);
        });
};

const detectNewVisitor = () => {
    let visitorId = getCookie('visitor_id');

    if (!visitorId) {
        const newVisitorId = generateUniqueVisitorId();

        setCookie('visitor_id', newVisitorId, 365);

        tmp_session_id == null ? startNewSession() : null;

        startNewSession();
        trackEvent('custom_event', {
            event_types: 'new_visitor',
            tag_id: null,
            tdate: new Date().toLocaleString(),
            visitor_id: newVisitorId,
            session_id: tmp_session_id,
            app_id: APP_ID,
        });
    } else {
        tmp_session_id == null ? startNewSession() : null;
        startNewSession();
        trackEvent('custom_event', {
            event_types: 'new_visitor',
            tag_id: null,
            tdate: new Date().toLocaleString(),
            visitor_id: visitorId,
            session_id: tmp_session_id,
            app_id: APP_ID,
        });
    }
};

// Function to set a cookie
const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Function to get a cookie value by name
const getCookie = (name) => {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i &lt; cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split('=');
        const cookieName = cookiePair[0].trim();
        if (cookieName === name) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
};

const detectSession = () => {

    const lastActivityTime = Cookies.get('last_activity_time');

    if (lastActivityTime) {
        const currentTime = new Date().getTime();
        const lastActivityTimestamp = parseInt(lastActivityTime);
        const sessionDuration = currentTime - lastActivityTimestamp;

        const sessionTimeout = 15 * 60 * 1000;

        if (sessionDuration > sessionTimeout) {
            const visitorId =  getCookie('visitor_id');
            const tdate = new Date().toLocaleString();
            const app_id = APP_ID;
            const pagesVisitedList = pagesVisited;

            trackEvent('session_event', {
                session_duration: sessionDuration,
                visitor_id: visitorId,
                tdate: tdate,
                app_id: app_id,
                pageVisited: pagesVisitedList,
            });

            startNewSession();
        }
    } else {
        startNewSession();
    }
};


const startNewSession = () => {
    tmp_session_id = generateUniqueSessionId();
    pagesVisited = [];
    Cookies.set('last_activity_time', new Date().getTime());
};

const generateUniqueVisitorId = () => {
    const visitorId = Math.floor(Math.random() * 1000000).toString();
    return visitorId;
};

const generateUniqueSessionId = () => {
    const sessionId = uuidv4();
    return sessionId;
};

const trackPageView = (url, title) => {
    pagesVisited.push({ url, title });
};

const trackerDirectiveForClick = {
    mounted(el, binding) {
        const { value } = binding;
        const { tag } = value;

        el.addEventListener('click', () => {
            const visitorId =  getCookie('visitor_id');
            const url = window.location.href;
            const res = window.screen.width + 'x' + window.screen.height;
            const rect = el.getBoundingClientRect();
            const position =  (rect.left + window.scrollX) + 'x' + (rect.top + window.scrollY);
            trackEvent('custom_event',
                {
                    event_types: 'click',
                    tag_id: tag,
                    tdate: new Date().toISOString(), // Use ISO string for tdate
                    visitor_id: visitorId,
                    session_id: tmp_session_id,
                    app_id: APP_ID,
                    url: url,
                    location: position,
                    screen_resolution: res,
                });
        });
    },
};


const trackerDirectiveForHover = {
    mounted(el, binding) {
        const { value } = binding;
        const { tag } = value;

        el.addEventListener('mouseover', () => {
            let visitorId =  getCookie('visitor_id');
            const url = window.location.href;
            const res = window.screen.width + 'x' + window.screen.height;
            const rect = el.getBoundingClientRect();
            const position =  (rect.left + window.scrollX) + 'x' + (rect.top + window.scrollY);
            trackEvent('custom_event',
                {
                    event_types: 'hover',
                    tag_id: tag,
                    tdate: new Date().toLocaleString(),
                    visitor_id: visitorId,
                    session_id: tmp_session_id,
                    app_id: APP_ID,
                    url: url,
                    location: position,
                    screen_resolution: res,
                });
        });
    },
};

// Create the SDK plugin
const vueTracker = {
    install(Vue) {
        Vue.directive('tracker-click', trackerDirectiveForClick);

        Vue.directive('tracker-hover', trackerDirectiveForHover);

        Vue.mixin({
            beforeCreate() {
                this.$tracker = {
                    trackEvent,
                    detectNewVisitor,
                    detectSession,
                    trackPageView,
                };
            },
        });
    },
};

export default vueTracker;


                                </code>>
                            </pre>
                            <div class="code-footer d-flex justify-content-center">
                                <button class="btn btn-link" @click="toggleFullCode">
                                    <font-awesome-icon :icon="showFullCode ? 'chevron-up' : 'chevron-down'" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
            
            
        <script>
        import Sidebar from './Sidebar.vue';
        import 'bootstrap/dist/css/bootstrap.css';
        import 'bootstrap';

        export default {
            components: {
                Sidebar,
            },
            data() {
                return {
                    showFullCode: false,
                };
            },
            mounted() {
                // this.$tracker.trackPageView('/example-page', 'Example Page');
            },
            methods: {
                copyCode() {
                    const el = document.createElement('textarea');
                    el.value = document.querySelector('.code').innerText;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                },
                toggleFullCode() {
                    this.showFullCode = !this.showFullCode;
                },
            },
        };
        </script>
        <style scoped>
        .sdk {
            display: flex;
        }

        .content {
            flex: 1;
            overflow: auto;
            /* Add the overflow property to enable scrolling */
            padding-bottom: 20px;
            margin-left: 60px;
            /* Add some padding to the bottom to prevent content from getting cut off */
            /* Other styles for the content */
        }

        .code-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .code {
            background-color: #f1f1f1;
            font-family: "Courier New", monospace;
            white-space: pre-wrap;
            overflow-x: auto;
            padding: 20px;
            max-height: 500px;
            /* Set a maximum height for the code */
            overflow-y: hidden;
            transition: max-height 0.3s ease;
            /* Add smooth transition animation */
        }

        .show-full-code {
            max-height: none;
            /* Show full code when the class is applied */
        }

        .code-footer {
            padding: 0.5rem;
        }

        pre {
            background-color: #a2a2a2 !important;
        }

        .btn-link {
            background-color: transparent;
            border: none;
            color: #007bff;
            cursor: pointer;
        }

        .btn-primary {
            background-color: #f8fafb !important;
            border-color: #f8fafb !important;
            border-radius: 2rem;
            color: black;
        }

        .btn-primary:hover {
            background-color: #e6e8ea !important;
            border-color: #e6e8ea !important;
            border-radius: 2rem;
            color: black;
        }

        .btn-primary:focus {
            background-color: #e6e8ea !important;
            border-color: #e6e8ea !important;
            border-radius: 2rem;
            color: black;
        }
        </style>
