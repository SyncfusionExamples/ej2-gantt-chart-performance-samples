import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-dependency-page',
  template: `
    <app-bench-section
      [title]="'Dependency / Critical-Path Recalculation'"
      [presets]="['loadDependency5000', 'loadDependency10000', 'loadDependency25000', 'loadDependency50000']"
      [labelSuffix]="'Records'"
      [dataset]="dataset"
    >
      <div summary>
        <div style="font-size: 13px; color: #475569;">
          <span *ngIf="dataset.isLoading">
            Loading {{ (dataset.currentSize || 5000) | number }} records...
          </span>
          <span *ngIf="!dataset.isLoading">
            {{ (dataset.currentSize || dataSource.length) | number }} records with dependency and critical path render time: 
            <b data-testid="dependency-render-s">
              {{ renderSeconds === null ? '—' : renderSeconds.toFixed(3) + ' s' }}
            </b>
          </span>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="dependency-gantt"
          [dataSource]="dataSource"
          [taskFields]="taskFields"
          height="450px"
          [enableVirtualization]="true"
          [enableTimelineVirtualization]="true"
          [treeColumnIndex]="1"
          [enableCriticalPath]="true"
          (dataBound)="onDataBound()"
        >
          <e-columns>
            <e-column field="ID" headerText="ID" width="80"></e-column>
            <e-column field="TaskName" headerText="Task Name"></e-column>
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
export class DependencyPageComponent implements OnInit {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: GanttTask[] = [];
  renderSeconds: number | null = null;
  
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
      renderSeconds: this.renderSeconds,
      measureRender: () => this.measureRender(),
      loaders: {
        loadDependency5000: () => this.loadDependency5000(),
        loadDependency10000: () => this.loadDependency10000(),
        loadDependency25000: () => this.loadDependency25000(),
        loadDependency50000: () => this.loadDependency50000()
      },
      refreshData: () => this.refreshData(),
      clearData: () => this.clearData()
    };
  }
  
  ngOnInit() {
    // Load initial data
    this.loadDependency5000();
  }
  
  onDataBound() {
    this.measureRender();
  }
  
  measureRender() {
    const renderTime = this.datasetService.measureRender();
    if (renderTime !== null) {
      this.renderSeconds = renderTime;
    }
  }
  
  // Loader methods
  async loadDependency5000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency5000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency10000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency10000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency25000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency25000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency50000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency50000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency100000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency100000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency200000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency200000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadDependency500000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadDependency500000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  refreshData() {
    if (this.dataset.currentSize === 10000) {
      this.loadDependency50000();
    } else if (this.dataset.currentSize === 50000) {
      this.loadDependency100000();
    } else if (this.dataset.currentSize === 100000) {
      this.loadDependency200000();
    } else if (this.dataset.currentSize === 200000) {
      this.loadDependency500000();
    } else {
      this.loadDependency10000();
    }
  }
  
  clearData() {
    this.dataSource = this.datasetService.clearData();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = 0;
    this.renderSeconds = null;
  }
}