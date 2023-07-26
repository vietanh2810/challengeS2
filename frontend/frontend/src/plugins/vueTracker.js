import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const socketUrl = 'http://localhost:8080/api/events';

const APP_ID = 'test';

let tmp_session_id = null;

let pagesVisited = [];

const trackEvent = (eventName, eventData) => {
    console.log(`Event tracked: ${eventName}`);
    console.log(eventData);

    // Send the event data to the backend (server) using a POST request
    // You can use Axios or any other HTTP library to make the request
    // Replace 'http://localhost:8080/api/events' with your backend API URL
    fetch(socketUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'App-Id': APP_ID, // Include the APP_ID in the request headers
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
    console.log(visitorId);

    if (!visitorId) {
        const newVisitorId = generateUniqueVisitorId();
        console.log('New visitor detected. Visitor ID:', newVisitorId);

        setCookie('visitor_id', newVisitorId, 365); // Set a cookie that expires in 365 days

        tmp_session_id == null ? startNewSession() : null;

        startNewSession();
        trackEvent('custom_event', {
            event_types: 'new_visitor',
            tag_id: null,
            tdate: new Date().toLocaleString(),
            visitor_id: newVisitorId,
            session_id: tmp_session_id,
        });
    } else {
        // The visitor already has a cookie, so you can use their existing visitorId for tracking
        tmp_session_id == null ? startNewSession() : null;
        startNewSession();
        trackEvent('custom_event', {
            event_types: 'new_visitor',
            tag_id: null,
            tdate: new Date().toLocaleString(),
            visitor_id: visitorId,
            session_id: tmp_session_id,
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
    for (let i = 0; i < cookieArr.length; i++) {
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

        const sessionTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds
        // const sessionTimeout = 10 * 1000; 

        if (sessionDuration > sessionTimeout) {
            const visitorId = sessionStorage.getItem('visitor_id');
            const tdate = new Date().toLocaleString();
            const app_id = APP_ID;
            const pagesVisitedList = pagesVisited;

            console.log('Session expired. Tracking session_event.');

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
    console.log('Generated unique visitor ID:', visitorId);
    return visitorId;
};

const generateUniqueSessionId = () => {
    const sessionId = uuidv4();
    return sessionId;
};

const trackPageView = (url, title) => {
    pagesVisited.push({ url, title });
};

const trackerDirective = {
    mounted(el, binding) {
        const { value } = binding;
        const { tag } = value;

        el.addEventListener('click', () => {
            let visitorId = sessionStorage.getItem('visitor_id');
            trackEvent('custom_event',
                {
                    event_types: 'click',
                    tag_id: tag,
                    tdate: new Date().toLocaleString(),
                    visitor_id: visitorId,
                    session_id: tmp_session_id,
                });
        });
    },
};

// Create the SDK plugin
const vueTracker = {
    install(Vue, options) {
        Vue.directive('tracker', trackerDirective);

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
