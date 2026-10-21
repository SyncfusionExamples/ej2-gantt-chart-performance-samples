import {
  CriticalPath,
  Edit,
  Gantt,
  Selection,
  Toolbar,
  VirtualScroll
} from '@syncfusion/ej2-gantt';
import './styles.css';
import {
  generateHierarchyStressDataset,
  generateStandardDataset
} from './data.js';

Gantt.Inject(Selection, VirtualScroll, Toolbar, CriticalPath, Edit);

const taskFields = {
  id: 'ID',
  name: 'TaskName',
  startDate: 'StartDate',
  duration: 'Duration',
  progress: 'Progress',
  parentID: 'ParentId',
  dependency: 'Predecessor'
};

const sections = [
  { id: 'initial-load', label: 'Initial Load', title: 'Initial Load — Gantt Render Time' },
  { id: 'interaction', label: 'Interaction Latency', title: 'CRUD Operation Latency' },
  { id: 'hierarchy', label: 'Hierarchy', title: 'Hierarchy — Expand / Collapse latency' },
  { id: 'dependency', label: 'Dependency', title: 'Dependency / Critical-Path Recalculation' },
  { id: 'memory', label: 'Memory', title: 'Memory Usage' },
  { id: 'stress', label: 'Stress Test', title: 'Hierarchy Stress Test' }
];

const normalPresets = [
  ['load5000', '5K Records'],
  ['load10000', '10K Records'],
  ['load25000', '25K Records'],
  ['load50000', '50K Records']
];
const datasets = Object.fromEntries(sections.map(({ id }) => [
  id,
  {
    records: [],
    currentSize: 0,
    isLoading: false,
    renderSeconds: null,
    renderStart: null,
    measureRender: false,
    error: null,
    token: 0
  }
]));

let activePage = 'initial-load';
let gantt = null;
let interactionTimes = { add: null, update: null, delete: null };
let hierarchyTimes = { expand: null, collapse: null };
let interactionStarts = { add: null, update: null, delete: null };
let expandStart = null;
let collapseStart = null;

function destroyGantt() {
  if (gantt) {
    gantt.destroy();
    gantt = null;
  }
}

function renderNavigation() {
  return sections.map(({ id, label }) => (
    `<button class="nav-button${id === activePage ? ' active' : ''}" data-page="${id}" type="button">${label}</button>`
  )).join('');
}

function renderDatasetButtons(page, state) {
  let presets = normalPresets;
  if (page === 'dependency') {
    presets = [
      ['loadDependency5000', '5K Records'],
      ['loadDependency10000', '10K Records'],
      ['loadDependency25000', '25K Records'],
      ['loadDependency50000', '50K Records']
    ];
  } else if (page === 'hierarchy') {
    presets = [
      ['loadHierarchy5000', '5K Records'],
      ['loadHierarchy10000', '10K Records'],
      ['loadHierarchy25000', '25K Records'],
      ['loadHierarchy50000', '50K Records']
    ];
  }

  const buttons = presets.map(([key, label]) => (
    `<button class="control-button" data-loader="${key}" type="button" ${state.isLoading ? 'disabled' : ''}>${label}</button>`
  )).join('');
  const refresh = `<button class="control-button" data-action="refresh" type="button" ${state.isLoading ? 'disabled' : ''}>Refresh</button>`;
  const clear = `<button class="control-button" data-action="clear" type="button" ${state.isLoading ? 'disabled' : ''}>Clear data</button>`;
  return `<div class="controls">${buttons}${refresh}${clear}</div>`;
}

function getSummary(page, state) {
  const size = (state.currentSize || state.records.length).toLocaleString();
  if (state.error) return `<span class="error">${state.error}</span>`;
  if (page === 'initial-load') {
    return `Render time of Gantt chart: <b>${state.renderSeconds === null ? '—' : `${state.renderSeconds.toFixed(3)} s`}</b>`;
  }
  if (page === 'interaction') {
    if (state.isLoading || state.records.length === 0) {
      return `<span class="muted">${state.isLoading ? 'Loading 5K dataset…' : 'Awaiting dataset…'}</span>`;
    }
    return `<div class="metric-list">
      <div>addRecord : <b>${interactionTimes.add === null ? 'add a record to record' : `${interactionTimes.add.toFixed(2)} ms`}</b></div>
      <div>updateRecordByID : <b>${interactionTimes.update === null ? 'update a record to record' : `${interactionTimes.update.toFixed(2)} ms`}</b></div>
      <div>deleteRecord : <b>${interactionTimes.delete === null ? 'delete a record to record' : `${interactionTimes.delete.toFixed(2)} ms`}</b></div>
    </div>`;
  }
  if (page === 'hierarchy') {
    return `<div class="metric-list">Expand all: <b>${hierarchyTimes.expand === null ? '—' : `${hierarchyTimes.expand.toFixed(2)} ms`}</b>
      <span>Collapse all: <b>${hierarchyTimes.collapse === null ? '—' : `${hierarchyTimes.collapse.toFixed(2)} ms`}</b></span></div>`;
  }
  if (page === 'dependency') {
    return state.isLoading
      ? `Loading ${Math.max(state.currentSize || 5000, 5000).toLocaleString()} records...`
      : `${size} records with dependency and critical path render time: <b>${state.renderSeconds === null ? '—' : `${state.renderSeconds.toFixed(3)} s`}</b>`;
  }
  if (page === 'memory') {
    return `${size} Records - Memory Consumption: <b>${state.memoryUsage === undefined || state.memoryUsage === null ? '—' : `${state.memoryUsage.toFixed(2)} MB`}</b>`;
  }
  if (page === 'stress') {
    return state.renderSeconds === null
      ? 'Initial hierarchy rendering report only.'
      : `Initial hierarchy rendering report: ${size} records at depth ${state.depth}, ${state.renderSeconds.toFixed(3)} s.`;
  }
  return '';
}

function renderPage() {
  destroyGantt();
  const state = datasets[activePage];
  const section = sections.find(({ id }) => id === activePage);
  const toolbar = activePage === 'hierarchy'
    ? '<div class="gantt-toolbar-note">Gantt toolbar: Expand All / Collapse All</div>'
    : '';
  const stressActions = activePage === 'stress'
    ? `<div class="actions">
        <button class="control-button" data-stress="25000,5" type="button" ${state.isLoading ? 'disabled' : ''}>Run 25K / 5 levels</button>
        <button class="control-button" data-stress="50000,10" type="button" ${state.isLoading ? 'disabled' : ''}>Run 50K / 10 levels</button>
        <button class="control-button" data-stress="75000,10" type="button" ${state.isLoading ? 'disabled' : ''}>Run 75K / 10 levels</button>
        <button class="control-button" data-stress="100000,10" type="button" ${state.isLoading ? 'disabled' : ''}>Run 100K / 10 levels</button>
        <button class="control-button" data-action="clear" type="button" ${state.isLoading || state.records.length === 0 ? 'disabled' : ''}>Clear</button>
      </div>`
    : '';
  const actions = activePage === 'interaction'
    ? `<div class="actions">
        <button class="control-button" data-crud="add" type="button" ${state.isLoading || state.records.length === 0 ? 'disabled' : ''}>Add record</button>
        <button class="control-button" data-crud="update" type="button" ${state.isLoading || state.records.length === 0 ? 'disabled' : ''}>Update record (ID: 201)</button>
        <button class="control-button" data-crud="delete" type="button" ${state.isLoading || state.records.length === 0 ? 'disabled' : ''}>Delete record (ID: 4901)</button>
      </div>`
    : '';

  document.querySelector('#app').innerHTML = `
    <nav class="navigation">
      <div class="brand"><strong>Syncfusion Gantt Benchmark</strong><span>Performance suite · JavaScript</span></div>
      <div class="nav-links">${renderNavigation()}</div>
    </nav>
    <main class="page">
      <h1>${section.title}</h1>
      ${activePage === 'stress' ? stressActions : renderDatasetButtons(activePage, state)}
      ${actions}
      ${activePage !== 'stress' ? `<div class="record-status">Current records: <b>${state.currentSize}</b>${state.isLoading ? '<span class="muted">Loading...</span>' : ''}</div>` : ''}
      ${toolbar}
      <div id="summary" class="summary">${getSummary(activePage, state)}</div>
      <div id="gantt-host"></div>
    </main>`;

  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => activatePage(button.dataset.page));
  });
  document.querySelectorAll('[data-loader]').forEach((button) => {
    button.addEventListener('click', () => {
      resetPageMetrics(activePage);
      loadPreset(activePage, button.dataset.loader);
    });
  });
  document.querySelector('[data-action="refresh"]')?.addEventListener('click', refreshData);
  document.querySelectorAll('[data-action="clear"]').forEach((button) => {
    button.addEventListener('click', clearData);
  });
  document.querySelectorAll('[data-stress]').forEach((button) => {
    button.addEventListener('click', () => {
      const [records, depth] = button.dataset.stress.split(',').map(Number);
      loadStress(records, depth);
    });
  });
  document.querySelectorAll('[data-crud]').forEach((button) => {
    button.addEventListener('click', () => runCrud(button.dataset.crud));
  });

  if (state.records.length > 0) mountGantt(section, state);
}

function resetPageMetrics(page) {
  if (page === 'interaction') {
    interactionTimes = { add: null, update: null, delete: null };
    interactionStarts = { add: null, update: null, delete: null };
  }
  if (page === 'hierarchy') {
    hierarchyTimes = { expand: null, collapse: null };
    expandStart = null;
    collapseStart = null;
  }
  if (page === 'memory') datasets[page].memoryUsage = null;
}

function updateSummary() {
  const summary = document.querySelector('#summary');
  if (summary) summary.innerHTML = getSummary(activePage, datasets[activePage]);
}

function activatePage(page) {
  if (page === activePage) return;
  activePage = page;
  renderPage();
  const state = datasets[page];
  if (state.isLoading) return;
  if (page === 'interaction' && state.records.length !== 5000) loadPreset(page, 'load5000');
  else if (page === 'hierarchy' && state.records.length === 0) loadPreset(page, 'loadHierarchy5000');
  else if (page === 'dependency') loadPreset(page, 'loadDependency5000');
  else if (page === 'memory' && state.records.length !== 25000) loadPreset(page, 'load25000');
}

function loadPreset(page, preset) {
  let options;
  if (preset.startsWith('loadDependency')) {
    options = {
      parentCount: Number(preset.replace('loadDependency', '')) / 50,
      childCount: 49,
      chainDates: true
    };
  } else if (preset.startsWith('loadHierarchy')) {
    options = {
      parentCount: Number(preset.replace('loadHierarchy', '')) / 50,
      childCount: 49,
      maxDepth: 10,
      includePredecessor: false,
      dateByGroup: true
    };
  } else {
    const records = Number(preset.replace('load', ''));
    options = { parentCount: records / 50, childCount: 49 };
  }
  loadDataset(page, () => generateStandardDataset(options));
}

function loadStress(records, depth) {
  datasets.stress.depth = depth;
  loadDataset('stress', () => generateHierarchyStressDataset(records, depth));
}

function loadDataset(page, generate) {
  const state = datasets[page];
  const token = ++state.token;
  state.isLoading = true;
  state.records = [];
  state.renderSeconds = null;
  state.memoryUsage = null;
  state.error = null;
  state.renderStart = performance.now();
  state.measureRender = true;
  renderPage();

  generate().then((records) => {
    if (token !== state.token) return;
    state.records = records;
    state.currentSize = records.length;
    state.isLoading = false;
    if (page === activePage) renderPage();
  }).catch((error) => {
    if (token !== state.token) return;
    state.isLoading = false;
    state.error = `Dataset generation failed: ${error.message}`;
    console.error('Failed to generate the Gantt benchmark dataset.', error);
    if (page === activePage) renderPage();
  });
}

function refreshData() {
  const size = datasets[activePage].currentSize;
  const preset = size === 10000 ? 'load50000'
    : size === 50000 ? 'load100000'
      : size === 100000 ? 'load200000'
        : size === 200000 ? 'load500000'
          : 'load10000';
  loadPreset(activePage, preset);
}

function clearData() {
  const state = datasets[activePage];
  state.token += 1;
  state.records = [];
  state.currentSize = 0;
  state.renderSeconds = null;
  state.memoryUsage = null;
  state.error = null;
  state.isLoading = false;
  state.measureRender = false;
  state.renderStart = null;
  renderPage();
}

function getColumns(page) {
  const columns = [
    { field: 'ID', headerText: 'ID', width: '80' },
    { field: 'TaskName', headerText: 'Task Name' },
    { field: 'StartDate', headerText: 'StartDate' },
    { field: 'Predecessor' }
  ];
  if (page === 'interaction' || page === 'memory' || page === 'stress') {
    columns[1].width = '250';
  }
  if (page === 'stress') columns[2].width = '250';
  return columns;
}

function mountGantt(section, state) {
  const host = document.querySelector('#gantt-host');
  host.id = `${section.id}-gantt`;
  const config = {
    dataSource: state.records,
    taskFields,
    columns: getColumns(section.id),
    height: '450px',
    enableVirtualization: true,
    enableTimelineVirtualization: true,
    treeColumnIndex: 1,
    dataBound: () => {
      if (state.measureRender && state.renderStart !== null) {
        state.renderSeconds = Math.round(((performance.now() - state.renderStart) / 1000) * 1000) / 1000;
        state.measureRender = false;
        state.renderStart = null;
        if (section.id === 'memory' && performance.memory) {
          state.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
        }
        updateSummary();
      }
    }
  };

  if (section.id === 'hierarchy') {
    config.collapseAllParentTasks = true;
    config.toolbar = ['ExpandAll', 'CollapseAll'];
    config.expanding = () => { expandStart = performance.now(); };
    config.expanded = () => {
      if (expandStart === null) return;
      hierarchyTimes.expand = performance.now() - expandStart;
      expandStart = null;
      updateSummary();
    };
    config.collapsing = () => { collapseStart = performance.now(); };
    config.collapsed = () => {
      if (collapseStart === null) return;
      hierarchyTimes.collapse = performance.now() - collapseStart;
      collapseStart = null;
      updateSummary();
    };
  }
  if (section.id === 'dependency') config.enableCriticalPath = true;
  if (section.id === 'interaction') {
    config.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true };
    config.actionComplete = onActionComplete;
  }

  gantt = new Gantt(config);
  gantt.appendTo(host);
}

function runCrud(operation) {
  if (!gantt) return;
  const now = performance.now();
  interactionStarts[operation] = now;
  if (operation === 'add') {
    const id = datasets.interaction.records.reduce(
      (max, record) => Math.max(max, Number(record.ID) || 0),
      0
    ) + 1;
    gantt.addRecord({
      ID: id,
      TaskName: `CRUD Task ${id}`,
      StartDate: new Date(2017, 1, 9),
      Duration: '5',
      Progress: 0,
      ParentId: null,
      Predecessor: ''
    }, 'Above');
  } else if (operation === 'update') {
    gantt.updateRecordByID({ ID: 201, TaskName: 'Updated Task', Progress: 50 });
  } else if (operation === 'delete') {
    gantt.deleteRecord(4901);
  }
}

function onActionComplete(args) {
  const action = args.requestType === 'add' ? 'add'
    : args.requestType === 'save' ? 'update'
      : args.requestType === 'delete' ? 'delete'
        : null;
  if (!action || interactionStarts[action] === null) return;
  interactionTimes[action] = performance.now() - interactionStarts[action];
  interactionStarts[action] = null;
  updateSummary();
}

renderPage();
