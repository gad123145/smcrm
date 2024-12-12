import { Project, Contact, Task, AIProjectInsight } from '../types/types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Projects
export const getProjects = (): Project[] => {
  const projects = localStorage.getItem('projects');
  return projects ? JSON.parse(projects) : [];
};

export const addProject = async (project: Omit<Project, 'id'>) => {
  const projects = getProjects();
  const newProject = { ...project, id: generateId() };
  projects.push(newProject);
  localStorage.setItem('projects', JSON.stringify(projects));
  return { data: newProject, error: null };
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem('projects', JSON.stringify(projects));
    return { data: projects[index], error: null };
  }
  return { data: null, error: 'Project not found' };
};

export const deleteProject = async (id: string) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  localStorage.setItem('projects', JSON.stringify(filteredProjects));
  
  // Also delete related insights
  const insights = getProjectInsights();
  const filteredInsights = insights.filter(i => i.project_id !== id);
  localStorage.setItem('project_insights', JSON.stringify(filteredInsights));
  
  return { error: null };
};

// Contacts
export const getContacts = (): Contact[] => {
  const contacts = localStorage.getItem('contacts');
  return contacts ? JSON.parse(contacts) : [];
};

export const addContact = async (contact: Omit<Contact, 'id'>) => {
  const contacts = getContacts();
  const newContact = { ...contact, id: generateId() };
  contacts.push(newContact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  return { data: newContact, error: null };
};

export const updateContact = async (id: string, updates: Partial<Contact>) => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updates };
    localStorage.setItem('contacts', JSON.stringify(contacts));
    return { data: contacts[index], error: null };
  }
  return { data: null, error: 'Contact not found' };
};

export const deleteContact = async (id: string) => {
  const contacts = getContacts();
  const filteredContacts = contacts.filter(c => c.id !== id);
  localStorage.setItem('contacts', JSON.stringify(filteredContacts));
  return { error: null };
};

// Tasks
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const addTask = async (task: Omit<Task, 'id'>) => {
  const tasks = getTasks();
  const newTask = { ...task, id: generateId() };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return { data: newTask, error: null };
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return { data: tasks[index], error: null };
  }
  return { data: null, error: 'Task not found' };
};

export const deleteTask = async (id: string) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  return { error: null };
};

// AI Project Insights
export const getProjectInsights = (): AIProjectInsight[] => {
  const insights = localStorage.getItem('project_insights');
  return insights ? JSON.parse(insights) : [];
};

export const addProjectInsight = async (insight: Omit<AIProjectInsight, 'id'>) => {
  const insights = getProjectInsights();
  const newInsight = { ...insight, id: generateId() };
  insights.push(newInsight);
  localStorage.setItem('project_insights', JSON.stringify(insights));
  return { data: newInsight, error: null };
};

export const deleteProjectInsight = async (projectId: string) => {
  const insights = getProjectInsights();
  const filteredInsights = insights.filter(i => i.project_id !== projectId);
  localStorage.setItem('project_insights', JSON.stringify(filteredInsights));
  return { error: null };
};
