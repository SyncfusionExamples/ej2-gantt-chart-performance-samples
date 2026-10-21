import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFieldsModel, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { DatasetService, GanttTask } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

interface StressPreset {
  key: string;
  label: string;
  records: number;
  depth: number;
}

interface StressReport {
  key: string;
  records: number;
  depth: number;
  actual: number;
  initialRenderSeconds: number;
}

@Component({
  selector: 'app-stress-page',
  template: `
    <app-bench-section
      title="Hierarchy Stress Test"
      [showControls]="false"
      [presets]="[]"
      [dataset]="dataset"
    >
      <div actions style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button
          *ngFor="let preset of stressPresets"
          (click)="runPreset(preset)"
          [disabled]="isRunning || dataset.isLoading"
        >
          {{ preset.label }}
        </button>
        <button
          (click)="clearData()"
          [disabled]="isRunning || dataset.isLoading || dataSource.length === 0"
        >
          Clear
        </button>
      </div>

      <div summary>
        <div style="font-size: 13px; color: #64748b;">
          Initial hierarchy rendering report only.
          <table *ngIf="report" style="border-collapse: collapse; margin-top: 4px;">
            <thead>
              <tr>
                <th style="padding: 2px 10px 2px 0; text-align: left; font-weight: normal;">Records</th>
                <th style="padding: 2px 10px 2px 0; text-align: left; font-weight: normal;">Depth</th>
                <th style="padding: 2px 0; text-align: left; font-weight: normal;">Initial render</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 2px 10px 2px 0;">
                  {{ report.records | number }}
                  <span *ngIf="report.actual !== report.records && report.actual" style="color: #94a3b8;">
                    ({{ report.actual | number }})
                  </span>
                </td>
                <td style="padding: 2px 10px 2px 0;">{{ report.depth }}</td>
                <td style="padding: 2px 0;">{{ report.initialRenderSeconds.toFixed(3) }} s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="dataSource.length > 0">
        <ejs-gantt
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
            <e-column field="StartDate" headerText="StartDate" width="250"></e-column>
            <e-column field="Predecessor"></e-column>
          </e-columns>
        </ejs-gantt>
      </div>
    </app-bench-section>
  `,
  standalone: true,
  imports: [CommonModule, GanttModule, BenchSectionComponent]
})
export class StressPageComponent {
  readonly stressPresets: StressPreset[] = [
    { key: 'p25k_5', label: 'Run 25K / 5 levels', records: 25000, depth: 5 },
    { key: 'p50k_10', label: 'Run 50K / 10 levels', records: 50000, depth: 10 },
    { key: 'p75k_10', label: 'Run 75K / 10 levels', records: 75000, depth: 10 },
    { key: 'p100k_10', label: 'Run 100K / 10 levels', records: 100000, depth: 10 }
  ];

  dataSource: GanttTask[] = [];
  taskFields: TaskFieldsModel;
  dataset: {
    dataSource: GanttTask[];
    isLoading: boolean;
    currentSize: number;
    renderSeconds: number | null;
  };
  report: StressReport | null = null;
  private activePreset: StressPreset | null = null;
  isRunning = false;

  constructor(
    private datasetService: DatasetService,
    ganttSetupService: GanttSetupService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.taskFields = ganttSetupService.taskFields;
    this.dataset = {
      dataSource: this.dataSource,
      isLoading: false,
      currentSize: 0,
      renderSeconds: null
    };
  }

  async runPreset(preset: StressPreset): Promise<void> {
    if (this.isRunning || this.dataset.isLoading) return;

    this.clearData();
    this.activePreset = preset;
    this.isRunning = true;
    this.dataset.isLoading = true;
    this.datasetService.startRenderTimer();

    try {
      this.dataSource = await this.datasetService.loadHierarchy(preset.records, preset.depth);
      this.dataset.dataSource = this.dataSource;
      this.dataset.currentSize = this.dataSource.length;
      this.dataset.isLoading = false;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.dataset.isLoading = false;
      this.isRunning = false;
      this.changeDetectorRef.markForCheck();
      throw error;
    }
  }

  onDataBound(): void {
    const renderSeconds = this.datasetService.measureRender();
    if (renderSeconds === null) return;

    this.dataset.renderSeconds = renderSeconds;
    if (this.activePreset) {
      this.report = {
        key: this.activePreset.key,
        records: this.activePreset.records,
        depth: this.activePreset.depth,
        actual: this.dataset.currentSize,
        initialRenderSeconds: renderSeconds
      };
    }
    this.isRunning = false;
    this.changeDetectorRef.markForCheck();
  }

  clearData(): void {
    this.dataSource = this.datasetService.clearData();
    this.dataset.dataSource = this.dataSource;
    this.dataset.currentSize = 0;
    this.dataset.renderSeconds = null;
    this.dataset.isLoading = false;
    this.report = null;
    this.activePreset = null;
    this.isRunning = false;
    this.changeDetectorRef.markForCheck();
  }
}
