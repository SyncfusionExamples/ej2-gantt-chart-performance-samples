import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  template: `
    <div style="
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    ">
      <header style="text-align: center; margin-bottom: 3rem;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">
          Syncfusion Gantt Benchmark Suite
        </h1>
        <p style="font-size: 1.25rem; color: #64748b; max-width: 600px; margin: 0 auto;">
          Comprehensive performance evaluation of Syncfusion Gantt components for React and Angular
        </p>
      </header>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #0f172a; margin-bottom: 1.5rem;">
          About This Benchmark Suite
        </h2>
        <div style="background: #f8fafc; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0;">
          <p style="color: #334155; line-height: 1.6; margin-bottom: 1rem;">
            This benchmark suite evaluates the performance characteristics of Syncfusion Gantt components 
            across various scenarios including initial load times, interaction responsiveness, memory usage, 
            and scalability with large datasets.
          </p>
          <p style="color: #334155; line-height: 1.6; margin-bottom: 1rem;">
            The suite is designed to provide comparable metrics between React and Angular implementations 
            to help developers make informed decisions about framework selection based on performance requirements.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
            <div style="background: white; border-radius: 0.375rem; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.5rem;">Framework Agnostic</h3>
              <p style="color: #64748b; font-size: 0.9rem;">Identical tests for React and Angular implementations</p>
            </div>
            <div style="background: white; border-radius: 0.375rem; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.5rem;">Comprehensive Metrics</h3>
              <p style="color: #64748b; font-size: 0.9rem;">Multiple performance dimensions measured</p>
            </div>
            <div style="background: white; border-radius: 0.375rem; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.5rem;">Real-world Scenarios</h3>
              <p style="color: #64748b; font-size: 0.9rem;">Tests based on actual usage patterns</p>
            </div>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #0f172a; margin-bottom: 1.5rem;">
          Available Benchmarks
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #dbeafe; color: #1d4ed8; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">1</span>
              Initial Load Performance
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Measures time from component instantiation to full rendering with various dataset sizes.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #eff6ff; color: #1d4ed8; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Time-to-Interactive</span>
              <span style="background: #eff6ff; color: #1d4ed8; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Render Time</span>
            </div>
          </div>

          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #dcfce7; color: #15803d; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">2</span>
              Interaction Latency
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Evaluates responsiveness of user interactions like selection, expansion, and editing.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #f0fdf4; color: #15803d; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Click Response</span>
              <span style="background: #f0fdf4; color: #15803d; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Hover Feedback</span>
            </div>
          </div>

          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #fef9c3; color: #854d0e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">3</span>
              Hierarchy Operations
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Tests expand/collapse performance with deeply nested task structures.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #fefce8; color: #854d0e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Tree Navigation</span>
              <span style="background: #fefce8; color: #854d0e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Node Expansion</span>
            </div>
          </div>

          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #ffe4e6; color: #b91c1c; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">4</span>
              Dependency Calculation
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Measures critical path calculation performance with complex dependency networks.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #fff1f2; color: #b91c1c; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Path Recalculation</span>
              <span style="background: #fff1f2; color: #b91c1c; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Link Updates</span>
            </div>
          </div>

          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #ede9fe; color: #5b21b6; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">5</span>
              Memory Usage
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Tracks heap memory consumption across different dataset sizes and operations.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #f3e8ff; color: #5b21b6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Heap Allocation</span>
              <span style="background: #f3e8ff; color: #5b21b6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">GC Impact</span>
            </div>
          </div>

          <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="font-weight: 600; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center;">
              <span style="background: #e0f2fe; color: #0369a1; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 0.75rem; font-size: 0.875rem;">6</span>
              Bundle Analysis
            </h3>
            <p style="color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
              Analyzes the impact of Gantt components on application bundle size and load times.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <span style="background: #f0f9ff; color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Asset Weight</span>
              <span style="background: #f0f9ff; color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Tree Shaking</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #0f172a; margin-bottom: 1.5rem;">
          Getting Started
        </h2>
        <div style="background: #f0f9ff; border-radius: 0.5rem; padding: 1.5rem; border: 1px solid #bae6fd;">
          <p style="color: #0369a1; line-height: 1.6; margin-bottom: 1rem;">
            Use the navigation menu above to select different benchmark categories. Each test provides:
          </p>
          <ul style="color: #0369a1; margin-left: 1.5rem; margin-bottom: 1rem;">
            <li style="margin-bottom: 0.5rem;">Performance metrics for various dataset sizes</li>
            <li style="margin-bottom: 0.5rem;">Detailed timing measurements</li>
            <li style="margin-bottom: 0.5rem;">Memory consumption analysis</li>
            <li style="margin-bottom: 0.5rem;">Comparison data between React and Angular</li>
          </ul>
          <p style="color: #0369a1; font-style: italic;">
            Note: For accurate results, run tests in production builds and with browser developer tools closed.
          </p>
        </div>
      </section>
    </div>
  `
})
export class LandingPageComponent {}