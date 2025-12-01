export const USER_ROLES = {
    CITIZEN: 'citizen',
    COMPANY: 'company',
    GOVERNMENT: 'government'
};

export const PERMISSIONS = {
    TRAFFIC: {
        VIEW: 'traffic:view',
        REPORT: 'traffic:report',
        ROUTE: 'traffic:route',
    },
    PROPERTY: {
        VIEW: 'property:view',
        REPORT: 'property:report',
        ALERT: 'property:alert',
    },
    SECURITY: {
        VIEW: 'security:view',
        REPORT: 'security:report',
    },
    LOGISTIC: {
        VIEW_ANALYTICS: 'logistics:analytics',
        MANAGE: 'logistics:manage',
        OPTIMIZE_ROUTE: 'logistics:optimize_route',
    },
    EMERGENCY: {
        SOS: 'emergency:sos',
        VIEW: 'emergency:view',
    },
    HAZARD: {
        VIEW: 'hazard:view',
        REPORT: 'hazard:report',
        ALERT: 'hazard:alert',
    },
    SUPERMARKET: {
        VIEW: 'supermarket:view',
        REPORT: 'supermarket:report',
        VALIDATE_SETTINGS: 'supermarket:validate_settings',
        ASK_PERMISSIONS: 'supermarket:ask_permissions',
    }
};

export const ROLE_PERMISSIONS = {
    [USER_ROLES.CITIZEN]: [
        PERMISSIONS.TRAFFIC.VIEW,
        PERMISSIONS.TRAFFIC.REPORT,
        PERMISSIONS.SECURITY.VIEW,
        PERMISSIONS.SECURITY.REPORT,
        PERMISSIONS.PROPERTY.VIEW,
        PERMISSIONS.EMERGENCY.SOS,
        PERMISSIONS.SUPERMARKET.VIEW,
        PERMISSIONS.SUPERMARKET.REPORT,
        PERMISSIONS.HAZARD.VIEW,
        PERMISSIONS.HAZARD.REPORT,
    ],
    [USER_ROLES.COMPANY]: [
        PERMISSIONS.TRAFFIC.VIEW,
        PERMISSIONS.TRAFFIC.REPORT,
        PERMISSIONS.SECURITY.VIEW,
        PERMISSIONS.SECURITY.REPORT,
        PERMISSIONS.PROPERTY.VIEW,
        PERMISSIONS.EMERGENCY.SOS,
        PERMISSIONS.HAZARD.VIEW,
        PERMISSIONS.HAZARD.REPORT,
        PERMISSIONS.SUPERMARKET.VIEW,
        PERMISSIONS.SUPERMARKET.REPORT,
        PERMISSIONS.SUPERMARKET.ASK_PERMISSIONS,
    ],
    [USER_ROLES.GOVERNMENT]: [
        ...Object.values(PERMISSIONS.TRAFFIC),
        ...Object.values(PERMISSIONS.PROPERTY),
        ...Object.values(PERMISSIONS.SECURITY),
        ...Object.values(PERMISSIONS.LOGISTIC),
        ...Object.values(PERMISSIONS.EMERGENCY),
        ...Object.values(PERMISSIONS.HAZARD),
        ...Object.values(PERMISSIONS.SUPERMARKET),
    ]
    // còn tiếp

};