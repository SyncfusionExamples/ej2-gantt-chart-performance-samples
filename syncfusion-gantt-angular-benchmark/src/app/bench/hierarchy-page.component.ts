import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-hierarchy-page',
  template: `
    <app-bench-section
      [title]="'Hierarchy — Expand / Collapse latency'"
      [presets]="['loadHierarchy5000', 'loadHierarchy10000', 'loadHierarchy25000', 'loadHierarchy50000']"
      [labelSuffix]="'Records'"
      [dataset]="dataset"
    >
      <div summary>
        <div style="font-size: 13px; color: #475569;">
          Expand all: <b>{{ expandMs === null ? '—' : expandMs.toFixed(2) + ' ms' }}</b>
          | 
          Collapse all: <b>{{ collapseMs === null ? '—' : collapseMs.toFixed(2) + ' ms' }}</b>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="hierarchy-gantt"
          [dataSource]="dataSource"
          [taskFields]="taskFields"
          height="450px"
          [enableVirtualization]="true"
          [enableTimelineVirtualization]="true"
          [treeColumnIndex]="1"
          [collapseAllParentTasks]="true"
          [toolbar]="toolbar"
          (dataBound)="onDataBound()"
          (expanding)="onExpanding()"
          (expanded)="onExpanded()"
          (collapsing)="onCollapsing()"
          (collapsed)="onCollapsed()"
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
export class HierarchyPageComponent implements OnInit {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: GanttTask[] = [];
  expandMs: number | null = null;
  collapseMs: number | null = null;
  expandStart: number | null = null;
  collapseStart: number | null = null;
  
  taskFields: TaskFieldsModel = {};
  toolbar: string[] = ['ExpandAll', 'CollapseAll'];
  
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
        loadHierarchy5000: () => this.loadHierarchy5000(),
        loadHierarchy10000: () => this.loadHierarchy10000(),
        loadHierarchy25000: () => this.loadHierarchy25000(),
        loadHierarchy50000: () => this.loadHierarchy50000()
      },
      onPresetClick: () => this.resetLatency(),
      refreshData: () => this.refreshData(),
      clearData: () => this.clearData()
    };
  }
  
  ngOnInit() {
    // Load initial data
    this.loadHierarchy5000();
  }
  
  onDataBound() {
    this.measureRender();
  }
  
  onExpanding() {
    this.expandStart = performance.now();
  }
  
  onExpanded() {
    if (this.expandStart === null) return;
    this.expandMs = performance.now() - this.expandStart;
    this.expandStart = null;
  }
  
  onCollapsing() {
    this.collapseStart = performance.now();
  }
  
  onCollapsed() {
    if (this.collapseStart === null) return;
    this.collapseMs = performance.now() - this.collapseStart;
    this.collapseStart = null;
  }
  
  measureRender() {
    const renderTime = this.datasetService.measureRender();
    if (renderTime !== null) {
      // We don't need to display render time for this page
    }
  }
  
  resetLatency() {
    this.expandStart = null;
    this.collapseStart = null;
    this.expandMs = null;
    this.collapseMs = null;
  }
  
  // Loader methods
  async loadHierarchy5000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy5000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy10000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy10000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy25000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy25000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy50000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy50000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy100000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy100000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy200000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy200000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async loadHierarchy500000() {
    this.dataset.isLoading = true;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    
    this.datasetService.startRenderTimer();
    this.dataSource = await this.datasetService.loadHierarchy500000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  refreshData() {
    if (this.dataset.currentSize === 10000) {
      this.loadHierarchy50000();
    } else if (this.dataset.currentSize === 50000) {
      this.loadHierarchy100000();
    } else if (this.dataset.currentSize === 100000) {
      this.loadHierarchy200000();
    } else if (this.dataset.currentSize === 200000) {
      this.loadHierarchy500000();
    } else {
      this.loadHierarchy10000();
    }
  }
  
  clearData() {
    this.dataSource = this.datasetService.clearData();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = 0;
    this.expandStart = null;
    this.collapseStart = null;
    this.expandMs = null;
    this.collapseMs = null;
  }
}