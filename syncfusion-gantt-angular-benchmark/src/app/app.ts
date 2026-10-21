import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchSectionComponent } from './bench/bench-section.component';
import { InitialLoadPageComponent } from './bench/initial-load-page.component';
import { HierarchyPageComponent } from './bench/hierarchy-page.component';
import { DependencyPageComponent } from './bench/dependency-page.component';
import { InteractionLatencyPageComponent } from './bench/interaction-latency-page.component';
import { MemoryPageComponent } from './bench/memory-page.component';
import { BundlePageComponent } from './bench/bundle-page.component';
import { StressPageComponent } from './bench/stress-page.component';

interface Section {
  id: string;
  label: string;
  detail: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    BenchSectionComponent,
    InitialLoadPageComponent,
    HierarchyPageComponent,
    DependencyPageComponent,
    InteractionLatencyPageComponent,
    MemoryPageComponent,
    BundlePageComponent,
    StressPageComponent
  ],
  styleUrl: './app.css'
})
export class App {
  activeId = 'initial-load';
  
  readonly SECTIONS: Section[] = [
    { id: 'initial-load', label: 'Initial Load', detail: 'Render time & time-to-interactive' },
    { id: 'interaction', label: 'Interaction Latency', detail: 'Click/select/hover response time' },
    { id: 'hierarchy', label: 'Hierarchy', detail: 'Expand / collapse latency' },
    { id: 'dependency', label: 'Dependency', detail: 'Critical-path recalculation' },
    { id: 'memory', label: 'Memory', detail: 'Heap usage across dataset sizes' },
    { id: 'bundle', label: 'Bundle Size', detail: 'Static asset weight breakdown' },
    { id: 'stress', label: 'Stress Test', detail: 'Breaking-point discovery' }
  ];
  
  onSelect(sectionId: string) {
    this.activeId = sectionId;
  }
}
