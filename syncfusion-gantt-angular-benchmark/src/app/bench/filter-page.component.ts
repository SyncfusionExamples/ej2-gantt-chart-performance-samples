import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-filter-page',
  template: `
    <app-bench-section
      [title]="'Filter Performance'"
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
            {{ (dataset.currentSize || dataSource.length) | number }} Records - Filter Time: 
            <b>{{ dataset.renderSeconds === null ? '—' : dataset.renderSeconds.toFixed(3) + 's' }}</b>
          </span>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="filter-gantt"
          [dataSource]="dataSource"
          [taskFields]="taskFields"
          height="450px"
          [allowFiltering]="true"
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
  imports: [CommonModule, GanttModule, BenchSectionComponent]
})
export class FilterPageComponent implements OnInit {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: GanttTask[] = [];
  taskFields: TaskFieldsModel = {};
  
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
      },
      refreshData: () => this.refreshData(),
      clearData: () => this.clearData()
    };
  }
  
  ngOnInit() {
    // Load initial data
    this.load25000();
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
  
  async load100000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load100000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  async load200000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load200000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  async load500000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.load500000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
  }
  
  refreshData() {
    if (this.dataset.currentSize === 10000) {
      this.load50000();
    } else if (this.dataset.currentSize === 50000) {
      this.load100000();
    } else if (this.dataset.currentSize === 100000) {
      this.load200000();
    } else if (this.dataset.currentSize === 200000) {
      this.load500000();
    } else {
      this.load10000();
    }
  }
  
  clearData() {
    this.dataSource = this.datasetService.clearData();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = 0;
    this.dataset.renderSeconds = null;
  }
}