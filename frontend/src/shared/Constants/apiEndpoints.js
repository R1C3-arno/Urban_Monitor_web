export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
    },

    TRAFFIC: {
        VIEW: '/citizen/traffic/view',
        REPORT: '/citizen/traffic/report',
        ROUTE: '/citizen/traffic/route'
    },

    SAFETY: {
        VIEW: '/citizen/safety/view',
        REPORT: '/citizen/safety/report',
    },

    PROPERTY: {
        VIEW: '/citizen/property/view',
        REPORT: '/citizen/property/report',
        ALERT: '/citizen/property/alert'
    },

    LOGISTICS: {
        ANALYTICS: '/business/logistics/analytics',
        MANAGE: '/business/logistics/manage',
    },

    GOVERNMENT: {
        PLANNING: '/government/planning',
        PERMITS: '/government/permits',
    }
};
