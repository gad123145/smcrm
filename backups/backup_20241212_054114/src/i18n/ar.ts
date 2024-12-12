import { clientsTranslations } from './translations/clients.ar';
import { dashboardTranslations } from './translations/dashboard.ar';
import { navTranslations } from './translations/nav.ar';
import { statusTranslations } from './translations/status.ar';
import { projectsTranslations } from './translations/projects.ar';
import { propertiesTranslations } from './translations/properties.ar';
import { tableTranslations } from './translations/table.ar';
import { tasksTranslations } from './translations/tasks.ar';
import { settingsTranslations } from './translations/settings.ar';
import { companiesTranslations } from './translations/companies.ar';
import { usersTranslations } from './translations/users.ar';
import { notificationsTranslations } from './translations/notifications.ar';

export default {
  translation: {
    welcome: "مرحباً",
    clients: clientsTranslations,
    dashboard: dashboardTranslations,
    nav: navTranslations,
    status: statusTranslations,
    projects: projectsTranslations,
    properties: propertiesTranslations,
    table: tableTranslations,
    tasks: tasksTranslations,
    settings: settingsTranslations,
    companies: companiesTranslations,
    users: usersTranslations,
    notifications: notificationsTranslations,
  }
} as const;