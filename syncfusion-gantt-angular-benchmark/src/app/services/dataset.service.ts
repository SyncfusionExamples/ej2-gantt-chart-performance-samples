import { Injectable } from '@angular/core';

export interface GanttTask {
  ID: number;
  TaskName: string;
  StartDate: Date;
  Duration: string;
  Progress: number;
  ParentId: number | null;
  Predecessor: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private dataVersion = 0;
  private renderStart: number | null = null;
  private measureEnabled = false;
  private dataId = 0;

  constructor() { }

  // Generate data asynchronously with chunked approach
  generateDataAsync(
    parentCount: number,
    childCount: number,
    maxDepth = 1,
    includePredecessor = true,
    dateByGroup = false,
    chainGroups = false,
    commonDate = false,
    chainDates = false
  ): Promise<GanttTask[]> {
    return new Promise((resolve) => {
      const version = ++this.dataVersion;
      const result: GanttTask[] = [];
      const total = parentCount * (1 + childCount);
      const chunkSize = total > 60000 ? 4000 : 2000;
      
      let idx = 0;
      let id = 0;
      let groupRootId: number | null = null;
      let groupStartDate: Date | null = null;
      const levelIds: number[][] = [];
      const taskDates = new Map<number, Date>();

      const rand = () => Math.floor(Math.random() * 100);

      const fillChunk = () => {
        if (version !== this.dataVersion) return;

        const end = Math.min(idx + chunkSize, total);

        for (; idx < end; idx++) {
          const childIndex = idx % (childCount + 1);
          const groupIndex = Math.floor(idx / (childCount + 1));
          
          if (childIndex === 0) {
            const parentId = ++id;
            groupStartDate = dateByGroup || commonDate || chainDates
              ? new Date(2017, 1, 9 + (
                commonDate
                  ? 0
                  : (chainDates ? groupIndex * 5 : groupIndex * (maxDepth + 1))
              ))
              : null;
            groupRootId = parentId;
            levelIds.length = 0;
            levelIds.push([parentId]);
            taskDates.set(parentId, groupStartDate as Date);
            result[idx] = {
              ID: parentId,
              TaskName: 'Task ' + parentId,
              StartDate: groupStartDate || new Date(2017, 1, 9),
              Duration: '5',
              Progress: rand(),
              ParentId: null,
              Predecessor: includePredecessor && chainGroups && groupIndex > 0
                ? (parentId - (childCount + 1)).toString()
                : ''
            };
          } else {
            const childId = ++id;
            const depth = maxDepth === 1
              ? 1
              : Math.min(maxDepth, Math.ceil((childIndex * maxDepth) / childCount));
            const parentIds = levelIds[depth - 1];
            const parentId = maxDepth === 1
              ? groupRootId
              : parentIds[(childIndex - 1) % parentIds.length];
            const taskDate = (dateByGroup || commonDate || chainDates) && depth < maxDepth
              ? new Date(
                groupStartDate!.getFullYear(),
                groupStartDate!.getMonth(),
                groupStartDate!.getDate() + depth
              )
              : (dateByGroup || commonDate || chainDates ? taskDates.get(parentId!) : null);

            if (!levelIds[depth]) levelIds[depth] = [];
            levelIds[depth].push(childId);
            taskDates.set(childId, taskDate as Date);
            result[idx] = {
              ID: childId,
              TaskName: 'Task ' + childId,
              StartDate: taskDate || new Date(2017, 1, 7),
              Duration: '5',
              Progress: rand(),
              ParentId: parentId,
              Predecessor: includePredecessor ? (childId - 1).toString() : ''
            };
          }
        }

        if (idx < total) {
          requestAnimationFrame(fillChunk);
        } else {
          this.dataId = id;
          resolve(result);
        }
      };

      setTimeout(fillChunk, 0);
    });
  }

  // Loaders for different dataset sizes
  load5000() {
    return this.generateDataAsync(100, 49);
  }

  loadDependency(targetRecords: number) {
    return this.generateDataAsync(targetRecords / 50, 49, 1, true, false, false, false, true);
  }

  loadDependency2500() {
    return this.loadDependency(2500);
  }

  loadDependency5000() {
    return this.loadDependency(5000);
  }

  loadDependency10000() {
    return this.loadDependency(10000);
  }

  loadDependency25000() {
    return this.loadDependency(25000);
  }

  loadDependency50000() {
    return this.loadDependency(50000);
  }

  loadDependency100000() {
    return this.loadDependency(100000);
  }

  loadDependency200000() {
    return this.loadDependency(200000);
  }

  loadDependency500000() {
    return this.loadDependency(500000);
  }

  load10000() {
    return this.generateDataAsync(200, 49);
  }

  load25000() {
    return this.generateDataAsync(500, 49);
  }

  load75000() {
    return this.generateDataAsync(1500, 49);
  }

  load80000() {
    return this.generateDataAsync(1600, 49);
  }

  load100000() {
    return this.generateDataAsync(2000, 49);
  }

  load200000() {
    return this.generateDataAsync(4000, 49);
  }

  load500000() {
    return this.generateDataAsync(10000, 49);
  }

  loadHierarchy5000() {
    return this.generateDataAsync(100, 49, 10, false, true);
  }

  load50000() {
    return this.generateDataAsync(1000, 49);
  }


  load300000() {
    return this.generateDataAsync(6000, 49);
  }

  load400000() {
    return this.generateDataAsync(8000, 49);
  }


  // Load hierarchy with specific depth
  loadHierarchy(targetRecords: number, depth: number) {
    if (depth < 2) depth = 2;
    
    return new Promise<GanttTask[]>((resolve) => {
      const version = ++this.dataVersion;
      const rand = () => Math.floor(Math.random() * 100);
      const projectStart = new Date(2017, 1, 9);
      const projectDays = 730;

      const total = Math.ceil(targetRecords / depth) * depth;
      const result: GanttTask[] = new Array(total);
      const chunkSize = total > 60000 ? 4000 : 2000;

      let idx = 0;

      const fillChunk = () => {
        if (version !== this.dataVersion) return;
        const end = Math.min(idx + chunkSize, total);

        while (idx < end) {
          const position = idx;
          const level = position % depth;
          const newId = position + 1;
          const parentId = level === 0 ? null : newId - 1;

          const chainStartDay = Math.floor(position / depth);
          const stride = Math.max(1, Math.floor(projectDays / Math.max(Math.ceil(total / depth), 1)));
          const dayOffset = Math.min(chainStartDay * stride, projectDays - 1) + level;
          const startDate = new Date(
            projectStart.getFullYear(),
            projectStart.getMonth(),
            projectStart.getDate() + dayOffset
          );

          const predecessor = parentId === null ? '' : `${parentId}FS+1d`;
          const duration = String(2 + ((newId * 7) % 11));

          result[idx] = {
            ID: newId,
            TaskName: `Task ${newId}`,
            StartDate: startDate,
            Duration: duration,
            Progress: rand(),
            ParentId: parentId,
            Predecessor: predecessor
          };
          idx += 1;
        }

        if (idx < total) {
          requestAnimationFrame(fillChunk);
        } else {
          this.dataId = total;
          resolve(result);
        }
      };

      setTimeout(fillChunk, 0);
    });
  }

  loadHierarchy10000() {
    return this.loadHierarchy(10000, 10);
  }

  loadHierarchy25000() {
    return this.loadHierarchy(25000, 10);
  }

  loadHierarchy50000() {
    return this.loadHierarchy(50000, 10);
  }

  loadHierarchy100000() {
    return this.loadHierarchy(100000, 10);
  }

  loadHierarchy200000() {
    return this.loadHierarchy(200000, 10);
  }

  loadHierarchy500000() {
    return this.loadHierarchy(500000, 10);
  }

  // Measure render time
  startRenderTimer() {
    this.renderStart = performance.now();
    this.measureEnabled = true;
  }

  measureRender(): number | null {
    if (!this.measureEnabled || this.renderStart === null) return null;
    const deltaSeconds = (performance.now() - this.renderStart) / 1000;
    this.measureEnabled = false;
    this.renderStart = null;
    return Math.round(deltaSeconds * 1000) / 1000;
  }

  // Refresh data based on current size
  refreshData(currentSize: number): Promise<GanttTask[]> {
    if (currentSize === 10000) return this.load50000();
    else if (currentSize === 50000) return this.load100000();
    else if (currentSize === 100000) return this.load200000();
    else if (currentSize === 200000) return this.load500000();
    else return this.load10000();
  }

  // Clear data
  clearData(): GanttTask[] {
    this.dataVersion++;
    this.measureEnabled = false;
    this.renderStart = null;
    this.dataId = 0;
    return [];
  }
}