import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

const LABEL_MAP: Record<string, string> = {
  load5000: '5K Tasks',
  loadDependency5000: '5K Tasks',
  loadDependency10000: '10K Tasks',
  loadDependency25000: '25K Tasks',
  loadDependency50000: '50K Tasks',
  loadHierarchy5000: '5K Tasks',
  loadHierarchy10000: '10K Tasks',
  loadHierarchy25000: '25K Tasks',
  loadHierarchy50000: '50K Tasks',
  load10000: '10K Tasks',
  load25000: '25K Tasks',
  load50000: '50K Tasks',
  load100000: '100K Tasks',
  load200000: '2L Tasks',
  load300000: '3L Tasks',
  load400000: '4L Tasks',
  load500000: '5L Tasks',
  load1000000: '10L Tasks'
};

@Component({
  selector: 'app-bench-section',
  template: `
    <section style="padding: 15px;">
      <h3 *ngIf="title">{{ title }}</h3>
      
      <div *ngIf="showControls !== false" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button 
            *ngFor="let preset of presets" 
            (click)="onPresetClickHandler(preset)"
            [disabled]="isLoading || dataset?.isLoading"
          >
            {{ getLabelText(preset) }}
          </button>
          <button
            *ngIf="showRefresh && dataset?.refreshData"
            (click)="refreshData()"
            [disabled]="isLoading || dataset?.isLoading"
          >
            Refresh
          </button>
          <button
            *ngIf="dataset?.clearData"
            (click)="clearData()"
            [disabled]="isLoading || dataset?.isLoading"
          >
            Clear data
          </button>
        </div>

        <div>
          Current records: <b>{{ dataset?.currentSize || 0 }}</b>
          <span *ngIf="dataset?.isLoading" style="margin-left: 10px;">Loading...</span>
        </div>
        
        <ng-content select="[actions-below]"></ng-content>
      </div>

      <ng-content select="[actions]"></ng-content>
      
      <div style="margin-top: 8px;">
        <ng-content select="[summary]"></ng-content>
      </div>
      
      <ng-content></ng-content>
    </section>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class BenchSectionComponent {
  @Input() title: string = '';
  @Input() presets: string[] = [];
  @Input() labelSuffix: string = 'Tasks';
  @Input() showControls: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() dataset: any;
  @Input() showRefresh: boolean = true;
  
  getLabelText(preset: string): string {
    const label = LABEL_MAP[preset] ?? preset;
    return label.replace('Tasks', this.labelSuffix);
  }
  
  onPresetClickHandler(preset: string) {
    // Handle preset click if dataset has loaders
    if (this.dataset && this.dataset.loaders && this.dataset.loaders[preset]) {
      this.dataset.loaders[preset]();
    }
    
    // Emit custom event if needed
    if (this.dataset && this.dataset.onPresetClick) {
      this.dataset.onPresetClick(preset);
    }
  }

  refreshData() {
    this.dataset.refreshData();
  }

  clearData() {
    this.dataset.clearData();
  }
}