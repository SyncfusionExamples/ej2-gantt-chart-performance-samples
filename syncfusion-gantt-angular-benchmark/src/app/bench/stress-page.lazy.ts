import { Component, ViewChild } from '@angular/core';
import { GanttComponent, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stress-page-lazy',
  template: `
    <app-bench-section
      [title]="'Stress Test'"
      [presets]="['load5000', 'load10000', 'load25000', 'load50000']"
      [labelSuffix]="'Records'"
      [dataset]="dataset"
    >
      <div summary>
        <div style="font-size: 13px; font-family: monospace; color: #0f172a;">
          <span *ngIf="dataset.isLoading">
            Loading {{ (dataset.currentSize || 25000) | number }} records...
          </span>
          <span *ngIf="!dataset.isLoading && dataSource.length === 0">
            Awaiting dataset...
          </span>
          <span *ngIf="!dataset.isLoading && dataSource.length > 0">
            {{ (dataset.currentSize || dataSource.length) | number }} Records - Render Time: 
            <b>{{ dataset.renderSeconds === null ? '—' : dataset.renderSeconds.toFixed(3) + 's' }}</b>
          </span>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="stress-gantt"
          [dataSource]="dataSource"
          [taskFields]="taskFields"
          height="450px"
          [enableVirtualization]="true"
          [enableTimelineVirtualization]="true"
          [treeColumnIndex]="1"
          (dataBound)="onDataBound()"
        >
          <e-columns>
            <e-column field="ID" headerText="ID" width="80"></e-column>
            <e-column field="TaskName" headerText="Task Name" width="250"></e-column>
            <e-column field="StartDate" headerText="StartDate"></e-column>
            <e-column field="Duration" headerText="Duration"></e-column>
            <e-column field="Progress" headerText="Progress"></e-column>
            <e-column field="Predecessor"></e-column>
          </e-columns>
        </ejs-gantt>
      </div>
    </app-bench-section>
  `,
  standalone: true,
  //imports: [GanttModule, BenchSectionComponent, CommonModule],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StressPageLazyComponent {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: any[] = [];
  taskFields: any = {};
  
  dataset: any;
  
  constructor(
    private datasetService: DatasetService,
    private ganttSetupService: GanttSetupService
  ) {
    this.taskFields = this.ganttSetupService.taskFields;
    
    // Initialize dataset object to match React structure
    this.dataset = {
      ganttRef: {},
      dataSource: this.dataSource,
      isLoading: false,
      currentSize: 0,
      renderSeconds: null,
      measureRender: () => this.measureRender(),
      loaders: {
        load5000: () => this.load5000(),
        load10000: () => this.load10000(),
        load25000: () => this.load25000(),
        load50000: () => this.load50000()
      }
    };
  }
  
  onDataBound() {
    this.measureRender();
  }
  
  measureRender() {
    const renderTime = this.datasetService.measureRender();
    if (renderTime !== null) {
      this.dataset.renderSeconds = renderTime;
    }
  }
  
  // Loader methods
  async load5000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load5000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  async load10000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load10000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  async load25000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load25000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  async load50000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load50000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
}