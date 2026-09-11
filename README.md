# Type Complexity Tracer

<div align="center">

<a href="https://marketplace.visualstudio.com/items?itemName=tsperf.tracer" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/tsperf.tracer.svg?color=blue&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://console.algora.io/challenges/tsperf" target="__blank"><img src="https://img.shields.io/badge/Algora-TSPerf%20Challenge-orange?logo=algora&logoColor=white" alt="Algora TSPerf Challenge" /></a>
<a href="https://github.com/tsperf/tracer/blob/main/LICENSE" target="__blank"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT" /></a>

> High-performance VS Code extension and interactive trace viewer to measure, profile, and optimize TypeScript type complexity within complex codebases and monorepos.

</div>

---

## 🏆 Origin & Algora Challenge

This project originated as a core submission for the **[Algora TSPerf Type Challenge](https://console.algora.io/challenges/tsperf)**. 

The primary mission is to democratize compiler diagnostic instrumentation for TypeScript developers, pinpointing expensive generic type evaluations, recursion bottlenecks, and heavy AST tokens directly within the editor workspace.

---

## ⚡ Features & Capabilities

### 1. Real-time type checking estimates
To avoid the overhead of launching a separate `tsserver`, Type Complexity Tracer queries the active VS Code language server for token timings in open files. It uses response latencies as a fast proxy for type complexity, adopting the architectural pattern of [`@definitelytyped/perf`](https://github.com/microsoft/DefinitelyTyped-tools/blob/41ba894ba571e55fa91ef0bb0d44d6eb6d201943/packages/perf).

### 2. Trace file view and metrics
Run the `Tracer: tsc trace` command to collect accurate compiler timings:
- Creates inline diagnostic annotations directly on affected source lines.
- Launches an interactive webview trace inspector with deep AST hierarchy navigation.
- If executed with a `tsc` build containing timestamps in `types.json`, type instantiation counts and memory metrics are rendered in real time.

### 3. Monorepo & Multi-Package Support
Run traces across sub-packages directly via the file explorer context menu.

---

## 🖥️ Trace Viewer UI Architecture

The built-in trace viewer (`ui/`) is powered by **Nuxt.js** and **Tailwind CSS**, featuring:
- **Hierarchical Tree Exploration**: Expandable node tree representing type instantiation depth.
- **Type Metrics Table**: Sortable columns for duration, instantiation count, and file location.
- **Bi-directional Navigation**: Seamless jumping between trace nodes and VS Code editor buffers.

---

## 🤝 Credits & Acknowledgments

We are deeply grateful to **[Algora](https://console.algora.io/)** for hosting and sponsoring the **[TSPerf Type Challenge](https://console.algora.io/challenges/tsperf)** and to all community contributors driving performance instrumentation forward.

---

## 🚀 Contributing & Roadmap

- [x] Document challenge origin in [Algora TSPerf Portal](https://console.algora.io/challenges/tsperf)
- [x] Modernize trace viewer UI layout and badges
- [ ] Implement persistent background worker threads for async AST delta profiling
- [ ] Add extended tsserver compiler diagnostics telemetry

Contributions, issues, and feature requests are welcome!

---

## 📄 License

Published under the [MIT License](./LICENSE).
