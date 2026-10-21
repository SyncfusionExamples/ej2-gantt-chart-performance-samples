import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-interaction-latency-page',
  template: `
    <app-bench-section
      [title]="'CRUD Operation Latency'"
      [presets]="['load5000', 'load10000', 'load25000', 'load50000']"
      [labelSuffix]="'Records'"
      [dataset]="dataset"
    >
      <div actions>
        <button (click)="addRecord()" [disabled]="dataset.isLoading || dataSource.length === 0">
          Add record
        </button>
        <button (click)="updateRecord()" [disabled]="dataset.isLoading || dataSource.length === 0" style="margin-left: 8px;">
          Update record (ID: 201)
        </button>
        <button (click)="deleteRecord()" [disabled]="dataset.isLoading || dataSource.length === 0" style="margin-left: 8px;">
          Delete record (ID: 4901)
        </button>
      </div>
      
      <div summary>
        <div *ngIf="dataset.isLoading || dataSource.length === 0" style="color: #64748b; font-size: 13px;">
          {{ dataset.isLoading ? 'Loading 5K dataset…' : 'Awaiting dataset…' }}
        </div>
        <div *ngIf="!dataset.isLoading && dataSource.length > 0" 
          style="display: flex; flex-direction: column; gap: 4px; font-size: 13px; margin-top: 8px; font-family: monospace; color: #0f172a;">
          <div>
            <span style="color: #64748b;">addRecord : </span>
            <span *ngIf="latest.add !== null"><b>{{ latest.add?.toFixed(2) }} ms</b></span>
            <span *ngIf="latest.add === null" style="color: #94a3b8;">add a record to record</span>
          </div>
          <div>
            <span style="color: #64748b;">updateRecordByID : </span>
            <span *ngIf="latest.update !== null"><b>{{ latest.update?.toFixed(2) }} ms</b></span>
            <span *ngIf="latest.update === null" style="color: #94a3b8;">update the added record to record</span>
          </div>
          <div>
            <span style="color: #64748b;">deleteRecord : </span>
            <span *ngIf="latest.delete !== null"><b>{{ latest.delete?.toFixed(2) }} ms</b></span>
            <span *ngIf="latest.delete === null" style="color: #94a3b8;">delete the added record to record</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="dataSource.length > 0">
        <ejs-gantt 
          #gantt
          id="interaction-gantt"
          [dataSource]="dataSource"
          [taskFields]="taskFields"
          height="450px"
          [enableVirtualization]="true"
          [enableTimelineVirtualization]="true"
          [treeColumnIndex]="1"
          [editSettings]="editSettings"
          (actionComplete)="onActionComplete($event)"
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
export class InteractionLatencyPageComponent implements OnInit {
  @ViewChild('gantt') gantt!: GanttComponent;
  
  dataSource: GanttTask[] = [];
  latest = {
    add: null as number | null,
    update: null as number | null,
    delete: null as number | null
  };
  
  taskFields: TaskFieldsModel = {};
  editSettings: any = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true
  };
  
  dataset: any;
  
  private addStart: number | null = null;
  private updateStart: number | null = null;
  private deleteStart: number | null = null;
  private crudRecordId: number | null = null;
  
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
      onPresetClick: () => this.resetLatency(),
      refreshData: () => this.refreshData(),
      clearData: () => this.clearData()
    };
  }
  
  ngOnInit() {
    // Load initial data
    this.load5000();
  }
  
  onDataBound() {
    this.measureRender();
  }
  
  onActionComplete(args: any) {
    const requestType = args?.requestType;
    let operation: [string, number | null] | null = null;
    
    if (requestType === 'add' && this.addStart !== null) {
      operation = ['add', this.addStart];
    } else if (requestType === 'save' && this.updateStart !== null) {
      operation = ['update', this.updateStart];
    } else if (requestType === 'delete' && this.deleteStart !== null) {
      operation = ['delete', this.deleteStart];
    }
    
    if (operation === null || operation[1] === null) return;
    
    const latency = performance.now() - operation[1];
    this.latest = { ...this.latest, [operation[0]]: latency };
    
    // Reset the start times
    if (operation[0] === 'add') this.addStart = null;
    if (operation[0] === 'update') this.updateStart = null;
    if (operation[0] === 'delete') this.deleteStart = null;
  }
  
  measureRender() {
    const renderTime = this.datasetService.measureRender();
    if (renderTime !== null) {
      // We don't need to display render time for this page
    }
  }
  
  resetLatency() {
    this.addStart = null;
    this.updateStart = null;
    this.deleteStart = null;
    this.crudRecordId = null;
    this.latest = {
      add: null,
      update: null,
      delete: null
    };
  }
  
  addRecord() {
    if (!this.gantt) return;
    
    // Find the highest ID in the current data
    const highestId = this.dataSource.reduce((highest, record) => (
      Math.max(highest, record.ID || 0)
    ), 0);
    
    const newId = highestId + 1;
    const record = {
      ID: newId,
      TaskName: `CRUD Task ${newId}`,
      StartDate: new Date(2017, 1, 9),
      Duration: '5',
      Progress: 0,
      ParentId: null,
      Predecessor: ''
    };
    
    this.addStart = performance.now();
    this.gantt.addRecord(record, 'Above');
    this.crudRecordId = newId;
  }
  
  updateRecord() {
    if (!this.gantt) return;
    
    this.updateStart = performance.now();
    this.gantt.updateRecordByID({
      ID: 201,
      TaskName: 'Updated Task',
      Progress: 50
    });
  }
  
  deleteRecord() {
    if (!this.gantt) return;
    
    this.deleteStart = performance.now();
    this.gantt.deleteRecord(4901);
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
    this.addStart = null;
    this.updateStart = null;
    this.deleteStart = null;
    this.crudRecordId = null;
    this.latest = {
      add: null,
      update: null,
      delete: null
    };
  }
}