import { importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  CriticalPathService,
  EditService,
  GanttModule,
  SelectionService,
  ToolbarService,
  VirtualScrollService
} from '@syncfusion/ej2-angular-gantt';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(GanttModule),
    SelectionService,
    VirtualScrollService,
    ToolbarService,
    CriticalPathService,
    EditService
  ]
}).catch(err => console.error(err));
