import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetService } from '../services/dataset.service';
import { GanttSetupService } from '../services/gantt-setup.service';
import { BenchSectionComponent } from './bench-section.component';

@Component({
  selector: 'app-bundle-page',
  template: `
    <app-bench-section
      title="Bundle Size"
      [showControls]="false"
    >
      <div summary>
        <div style="font-size: 13px; font-family: monospace; color: #0f172a;">
          Bundle analysis performed during build
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <h3>Bundle Analysis</h3>
        <p>
          This page shows the bundle size impact of the Syncfusion Gantt component in the application.
          The analysis is performed during the build process using webpack bundle analyzer.
        </p>
        
        <div *ngIf="bundleStats" style="margin-top: 20px;">
          <h4>Bundle Statistics</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold;">Total Bundle Size</div>
              <div style="font-size: 1.2em; color: #2563eb;">{{ formatBytes(bundleStats.totalBundleSize) }}</div>
            </div>
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold;">Gantt Component Size</div>
              <div style="font-size: 1.2em; color: #2563eb;">{{ formatBytes(bundleStats.ganttSize) }}</div>
            </div>
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold;">Percentage of Total</div>
              <div style="font-size: 1.2em; color: #2563eb;">{{ bundleStats.ganttPercentage.toFixed(2) }}%</div>
            </div>
          </div>
        </div>
        
        <div *ngIf="bundleStats?.modules" style="margin-top: 20px;">
          <h4>Gantt Related Modules</h4>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Module</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Size</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let module of bundleStats.modules" style="border-bottom: 1px solid #eee;">
                <td style="border: 1px solid #ddd; padding: 8px;">{{ module.name }}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{ formatBytes(module.size) }}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{ module.percentage.toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 20px;">
          <h4>How to Run Bundle Analysis</h4>
          <pre style="background: #f1f5f9; padding: 15px; border-radius: 4px; overflow-x: auto;">
npm run build:analyze
          </pre>
          <p>
            This will generate a bundle report in the <code>public/bundle-report.html</code> file 
            and statistics in <code>public/bundle-stats.json</code>.
          </p>
        </div>
      </div>
    </app-bench-section>
  `,
  standalone: true,
  imports: [CommonModule, BenchSectionComponent]
})
export class BundlePageComponent implements OnInit {
  bundleStats: any = null;
  
  constructor(
    private datasetService: DatasetService,
    private ganttSetupService: GanttSetupService
  ) {}
  
  ngOnInit() {
    this.loadBundleStats();
  }
  
  async loadBundleStats() {
    try {
      // Try to load bundle stats from the public directory
      const response = await fetch('/bundle-stats.json');
      if (response.ok) {
        this.bundleStats = await response.json();
      }
    } catch (error) {
      console.warn('Could not load bundle stats:', error);
      // Use mock data if real data is not available
      this.bundleStats = this.getMockBundleStats();
    }
  }
  
  getMockBundleStats() {
    return {
      totalBundleSize: 1024000,
      ganttSize: 768000,
      ganttPercentage: 75.0,
      modules: [
        { name: '@syncfusion/ej2-gantt', size: 512000, percentage: 50.0 },
        { name: '@syncfusion/ej2-base', size: 128000, percentage: 12.5 },
        { name: '@syncfusion/ej2-data', size: 64000, percentage: 6.25 },
        { name: '@syncfusion/ej2-grids', size: 64000, percentage: 6.25 },
        { name: '@syncfusion/ej2-navigations', size: 32000, percentage: 3.125 },
        { name: '@syncfusion/ej2-calendars', size: 16000, percentage: 1.5625 },
        { name: '@syncfusion/ej2-inputs', size: 16000, percentage: 1.5625 },
        { name: '@syncfusion/ej2-buttons', size: 8000, percentage: 0.78125 },
        { name: '@syncfusion/ej2-popups', size: 8000, percentage: 0.78125 },
        { name: '@syncfusion/ej2-lists', size: 4000, percentage: 0.390625 },
        { name: '@syncfusion/ej2-splitbuttons', size: 4000, percentage: 0.390625 }
      ]
    };
  }
  
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}