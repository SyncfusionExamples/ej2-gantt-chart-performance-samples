# Syncfusion Gantt Benchmark — JavaScript

Plain JavaScript EJ2 counterpart to the active Gantt workloads in the React benchmark. Start with `npm install`, then `npm run start`; create a production build with `npm run build` and run the dataset tests with `npm test`.

## Migration inventory

| Area | React source | JavaScript target |
|---|---|---|
| Data source | `useDataset.js`; chunked generated records | Same record builders, chunk sizes, random progress, IDs and preset sizes in `src/data.js` |
| Task fields | ID, TaskName, StartDate, Duration, Progress, ParentId, Predecessor | Same field map |
| Modules | Selection, VirtualScroll; plus page-specific Toolbar, CriticalPath, Edit | Same EJ2 modules; feature modules are used only by their corresponding page |
| Columns | ID, Task Name, StartDate, Predecessor; page-specific widths | Same fields, labels, order and widths |
| Timeline | EJ2 defaults; timeline virtualization enabled | Same EJ2 defaults and timeline virtualization |
| Scheduling | EJ2 defaults; generated dates, durations and dependencies | Same mappings, data values and EJ2 defaults |
| Resources | None | None |
| Templates | None | None |
| Events | dataBound; CRUD and hierarchy timing callbacks | Same callbacks and measured operations |
| Dimensions | 450px Gantt; shared benchmark page layout | 450px Gantt; matching benchmark controls and navigation |
| Notes | No Notes Editor or notes workflow in the React workload | None, matching source |

## Source and target versions

| Package | React source | JavaScript target |
|---|---:|---:|
| React | 19.3.0 | Not used |
| React DOM | 19.3.0 | Not used |
| `@syncfusion/ej2-react-gantt` | 35.1.37 | Not used |
| `@syncfusion/ej2-gantt` | 35.1.37 (transitive source version) | 35.1.37 |
| Vite | CRA / `react-scripts` 5.0.1 | 6.4.4 |
| EJ2 theme stylesheet | Tailwind 3, CDN 34.2.2 | Same Tailwind 3, CDN 34.2.2 |

## React property mapping

| React property / element | JavaScript equivalent | Status |
|---|---|---|
| `ref={ganttRef}` | Retained `Gantt` instance in `gantt` | EQUIVALENT |
| `id` | Same page-specific DOM ID (`*-gantt`) | MATCHED |
| `dataSource` | Same generated data records | MATCHED |
| `taskFields` | Same `taskFields` object | MATCHED |
| `height="450px"` | `height: '450px'` | MATCHED |
| `enableVirtualization` | `enableVirtualization: true` | MATCHED |
| `enableTimelineVirtualization` | `enableTimelineVirtualization: true` | MATCHED |
| `treeColumnIndex` | `treeColumnIndex: 1` | MATCHED |
| `collapseAllParentTasks` (Hierarchy) | `collapseAllParentTasks: true` | MATCHED |
| `toolbar` (Hierarchy) | `toolbar: ['ExpandAll', 'CollapseAll']` | MATCHED |
| `enableCriticalPath` (Dependency) | `enableCriticalPath: true` | MATCHED |
| `editSettings` (Interaction) | Same allowAdding / allowEditing / allowDeleting values | MATCHED |
| `<ColumnsDirective>` / `<ColumnDirective>` | `columns` array, same order, field, header and widths | EQUIVALENT |
| `dataBound` | Gantt `dataBound` callback; single-shot render timer | EQUIVALENT |
| `expanding` / `expanded` | Same callbacks and expand latency measurement | EQUIVALENT |
| `collapsing` / `collapsed` | Same callbacks and collapse latency measurement | EQUIVALENT |
| `actionComplete` | Same CRUD request-type latency measurement | EQUIVALENT |
| `<Inject services={...}>` | `Gantt.Inject(...)` | EQUIVALENT |
| `timelineSettings`, work week / working-time properties, project bounds | Not set in React; retain EJ2 defaults | MATCHED |

No active React Gantt page configures resources, templates, baselines, or custom task fields beyond the shared map. `Filter` and `Sort` pages are disabled in the React navigation and are not included here; the Bundle Size page is excluded because bundle analysis is explicitly out of scope.

## Module mapping

| React-injected module | JavaScript EJ2 module | Enabled workload |
|---|---|---|
| `Selection` | `Selection` | All Gantt pages |
| `VirtualScroll` | `VirtualScroll` | All Gantt pages |
| `Toolbar` | `Toolbar` | Hierarchy |
| `CriticalPath` | `CriticalPath` | Dependency |
| `Edit` | `Edit` | Interaction Latency |

## Parity and validation

| Area | React | JavaScript | Status |
|---|---|---|---|
| Data / hierarchy | 5K–50K standard controls plus refresh sizes; hierarchy and stress generators | Same generated record shapes, hierarchy algorithms and active presets | MATCHED |
| Dependencies | 5K–50K dependency presets; predecessor chains | Same dependency generation and critical-path feature | MATCHED |
| Columns / dimensions | Shared four-column set, page-specific widths, 450px chart | Same | MATCHED |
| Timeline / scheduling | EJ2 defaults plus both virtualization options | Same | MATCHED |
| Modules / editing | Page-specific services and CRUD / expand-collapse actions | Same services and actions; exercised in browser | MATCHED |
| Resources / templates / notes | Not configured / not present | Not configured / not present | MATCHED |
| Bundle Size section | Present in the React benchmark shell | Omitted by request; no bundle analysis performed | INTENTIONAL EXCLUSION |
| Filter / Sort sections | Disabled in React navigation | Omitted | MATCHED (inactive) |

**Build:** PASS (`npm run build`)  
**Runtime:** PASS (`npm run start`; browser verified)  
**Gantt rendering:** PASS (5,000-record Gantt rendered with hierarchy rows, timeline taskbars, dependency connectors and columns)  
**Benchmark readiness:** READY FOR PERFORMANCE TESTING

Dataset tests cover standard record mappings, hierarchy stress depth and predecessor generation. The browser check exercised initial rendering, interaction add/update/delete latency, hierarchy expand/collapse timing, and critical-path activation. No Notes Editor exists in the React source workload, so no Notes Editor package or revision applies.
