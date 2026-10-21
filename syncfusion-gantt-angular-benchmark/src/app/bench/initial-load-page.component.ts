import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-initial-load-page',
  template: `
    <app-bench-section
      [title]="'Initial Load — Gantt Render Time'"
      [showRefresh]="false"
      [presets]="['load5000', 'load10000', 'load25000', 'load50000']"
      [dataset]="dataset"
    >
      <div summary>
        Render time of Gantt chart: 
        <b data-testid="initial-load-render-s">
          {{ renderSeconds !== null ? renderSeconds.toFixed(3) + ' s' : '—' }}
        </b>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="initial-load-gantt"
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
export class InitialLoadPageComponent {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: GanttTask[] = [];
  renderSeconds: number | null = null;
  dataset: any;
  
  taskFields: TaskFieldsModel = {};
  
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
        load5000: () => this.load5000(),
        load10000: () => this.load10000(),
        load25000: () => this.load25000(),
        load50000: () => this.load50000()
      },
      refreshData: () => this.refreshData(),
      clearData: () => this.clearData()
    };
  }
  
  onDataBound() {
    this.measureRender();
  }
  
  measureRender() {
    const renderTime = this.datasetService.measureRender();
    if (renderTime !== null) {
      this.renderSeconds = renderTime;
      this.dataset.renderSeconds = renderTime;
    }
  }
  
  // Loader methods
  async load5000() {
    this.dataset.isLoading = true;
    this.datasetService.startRenderTimer();
    this.renderSeconds = null;
    this.dataset.renderSeconds = null;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    this.changeDetectorRef.markForCheck();
    
    this.dataSource = await this.datasetService.load5000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async load10000() {
    this.dataset.isLoading = true;
    this.datasetService.startRenderTimer();
    this.renderSeconds = null;
    this.dataset.renderSeconds = null;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    this.changeDetectorRef.markForCheck();
    
    this.dataSource = await this.datasetService.load10000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async load25000() {
    this.dataset.isLoading = true;
    this.datasetService.startRenderTimer();
    this.renderSeconds = null;
    this.dataset.renderSeconds = null;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    this.changeDetectorRef.markForCheck();
    
    this.dataSource = await this.datasetService.load25000();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = this.dataSource.length;
    this.dataset.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }
  
  async load50000() {
    this.dataset.isLoading = true;
    this.datasetService.startRenderTimer();
    this.renderSeconds = null;
    this.dataset.renderSeconds = null;
    this.dataSource = [];
    this.dataset.dataSource = this.dataSource;
    this.changeDetectorRef.markForCheck();
    
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
    this.renderSeconds = null;
  }
}