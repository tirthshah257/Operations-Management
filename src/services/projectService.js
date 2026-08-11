import { storageService } from './storageService';
import { auditService } from './auditService';

export const projectService = {
  getProjects() {
    const projects = storageService.getItem(storageService.KEYS.PROJECTS, []);
    return projects.map(p => {
      const tasks = p.tasks || [];
      const completedCount = tasks.filter(t => t.status === 'Completed').length;
      const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : p.progress || 0;
      return { ...p, progress, completedTaskCount: completedCount, totalTaskCount: tasks.length };
    });
  },

  getProjectById(id) {
    return this.getProjects().find(p => p.id === id) || null;
  },

  createProject(projData) {
    const projects = storageService.getItem(storageService.KEYS.PROJECTS, []);
    const count = projects.length + 1;
    const projId = `PRJ-${String(count).padStart(3, '0')}`;

    const newProject = {
      ...projData,
      id: projId,
      projectCode: projId,
      progress: 0,
      spent: Number(projData.spent) || 0,
      budget: Number(projData.budget) || 0,
      status: projData.status || 'Planned',
      tasks: projData.tasks || [],
      milestones: projData.milestones || []
    };

    projects.unshift(newProject);
    storageService.setItem(storageService.KEYS.PROJECTS, projects);

    auditService.logAction({
      module: 'Projects',
      action: 'CREATE',
      recordId: projId,
      description: `Created project ${projId} [${newProject.projectName}]`
    });

    return newProject;
  },

  addTaskToProject(projectId, taskData) {
    const projects = storageService.getItem(storageService.KEYS.PROJECTS, []);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      const tasks = projects[index].tasks || [];
      const newTask = {
        id: `TSK-${Date.now()}`,
        title: taskData.title,
        assigneeId: taskData.assigneeId || 'USR-004',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        priority: taskData.priority || 'Medium',
        status: 'Not Started'
      };
      tasks.push(newTask);
      projects[index].tasks = tasks;

      storageService.setItem(storageService.KEYS.PROJECTS, projects);
      return projects[index];
    }
    return null;
  },

  updateTaskStatus(projectId, taskId, newStatus) {
    const projects = storageService.getItem(storageService.KEYS.PROJECTS, []);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      const taskIndex = projects[index].tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        projects[index].tasks[taskIndex].status = newStatus;
        storageService.setItem(storageService.KEYS.PROJECTS, projects);
        return projects[index];
      }
    }
    return null;
  }
};
