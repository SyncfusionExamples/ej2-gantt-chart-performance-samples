import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-memory-page',
  template: `
    <app-bench-section
      [title]="'Memory Usage'"
      [presets]="['load5000', 'load10000', 'load25000', 'load50000']"
      [labelSuffix]="'Records'"
      [dataset]="dataset"
    >
      <div summary>
        <div style="font-size: 13px; font-family: monospace; color: #0f172a;">
          <span *ngIf="dataset.isLoading">
            Loading {{ (Math.max(dataset.currentSize || 25000, 25000)) | number }} records...
          </span>
          <span *ngIf="!dataset.isLoading && dataSource.length === 0">
            Awaiting dataset...
          </span>
          <span *ngIf="!dataset.isLoading && dataSource.length > 0">
            {{ (dataset.currentSize || dataSource.length) | number }} Records - Memory Consumption: 
            <b>{{ memoryUsage === null ? '—' : memoryUsage.toFixed(2) + ' MB' }}</b>
          </span>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="memory-gantt"
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
            <e-column field="Predecessor"></e-column>
          </e-columns>
        </ejs-gantt>
      </div>
    </app-bench-section>
  `,
  standalone: true,
  imports: [CommonModule, GanttModule, BenchSectionComponent]
})
export class MemoryPageComponent implements OnInit {
  @ViewChild('gantt') gantt!: GanttComponent;
  readonly Math = Math;
  
  dataSource: GanttTask[] = [];
  memoryUsage: number | null = null;
  
  taskFields: TaskFieldsModel = {};
  
  dataset: any;
  
  constructor(
    private datasetService: DatasetService,
    private ganttSetupService: GanttSetupService,
    private changeDetectorRef: ChangeDetectorRef
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
      onPresetClick: () => this.resetMemoryUsage(),
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
      // We don't need to display render time for this page
    }
    
    // Measure memory usage if performance.memory is available
    if (this.memoryUsage !== null || !(performance as any).memory) return;
    
    const memory = (performance as any).memory;
    if (memory) {
      this.memoryUsage = memory.usedJSHeapSize / (1024 * 1024);
    }
  }
  
  resetMemoryUsage() {
    this.memoryUsage = null;
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
    this.memoryUsage = null;
  }
}