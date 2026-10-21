import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GanttSetupService {
  // Task fields mapping
  taskFields = {
    id: 'ID',
    name: 'TaskName',
    startDate: 'StartDate',
    duration: 'Duration',
    progress: 'Progress',
    parentID: 'ParentId',
    dependency: 'Predecessor'
  };

  constructor() { }

  // Get the core services used by all pages
  getCoreServices() {
    return ['SelectionService', 'VirtualScrollService'];
  }

  // Get services for specific pages
  getPageServices(page: string) {
    const coreServices = this.getCoreServices();
    
    switch (page) {
      case 'hierarchy':
        return [...coreServices, 'ToolbarService'];
      case 'dependency':
        return [...coreServices, 'CriticalPathService'];
      case 'interaction':
        return [...coreServices, 'EditService'];
      case 'filter':
        return [...coreServices, 'FilterService'];
      case 'sort':
        return [...coreServices, 'SortService'];
      default:
        return coreServices;
    }
  }
}