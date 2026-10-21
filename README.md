# Syncfusion Gantt Performance Benchmark Samples

This repository contains sample applications for exploring and comparing the performance of the Syncfusion EJ2 Gantt Chart across React, Angular, and JavaScript. Each platform sample is a standalone app with benchmark workloads for scenarios such as initial rendering, large datasets, hierarchy, dependencies, interaction latency, and memory use.

## Samples

| Platform | Folder |
| --- | --- |
| React | [`syncfusion-gantt-react-benchmark`](./syncfusion-gantt-react-benchmark/) |
| Angular | [`syncfusion-gantt-angular-benchmark`](./syncfusion-gantt-angular-benchmark/) |
| JavaScript | [`syncfusion-gantt-js-benchmark`](./syncfusion-gantt-js-benchmark/) |

## Run a sample

Use Node.js and npm, then open a terminal in the folder for the platform you want to run. Install that sample's dependencies and start its development server.

### React

```bash
cd syncfusion-gantt-react-benchmark
npm install
npm start
```

### Angular

```bash
cd syncfusion-gantt-angular-benchmark
npm install
npm start
```

The Angular app can also be started with `npx ng serve` after installing dependencies.

### JavaScript

```bash
cd syncfusion-gantt-js-benchmark
npm install
npm run start
```

The development server prints its local URL in the terminal when it starts.

## Benchmarking

Each sample provides Gantt performance scenarios using representative task datasets. To compare platforms, run the same workload and dataset size under consistent browser, machine, and environment conditions. Results can vary with hardware, browser versions, and background activity; treat them as measurements for the tested setup rather than universal performance guarantees.
