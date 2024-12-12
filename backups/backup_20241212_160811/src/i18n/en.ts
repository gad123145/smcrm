import { clientsTranslations } from './translations/clients.en';
import { dashboardTranslations } from './translations/dashboard.en';
import { navTranslations } from './translations/nav.en';
import { statusTranslations } from './translations/status.en';
import { projectsTranslations } from './translations/projects.en';
import { propertiesTranslations } from './translations/properties.en';
import { tableTranslations } from './translations/table.en';
import { tasksTranslations } from './translations/tasks.en';
import { settingsTranslations } from './translations/settings.en';
import { companiesTranslations } from './translations/companies.en';
import { usersTranslations } from './translations/users.en';
import { notificationsTranslations } from './translations/notifications.en';

export default {
  translation: {
    welcome: "Welcome",
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