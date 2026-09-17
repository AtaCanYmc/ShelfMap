# ShelfMap Roadmap

This document defines the technical milestones and planned capabilities for ShelfMap. Priorities are driven by real maker workshop requirements, offline usability, and data sovereignty.

---

## Current Release: v1.0.0 (Baseline Foundation)

- [x] **Arbitrary-Depth Storage Tree**: Recursive container hierarchy (`parent_id`) supporting rooms, cabinets, drawers, boxes, and compartments.
- [x] **Cycle-Detection Engine**: O(N) ancestor chain verification preventing recursive loops during moves.
- [x] **Bring-Your-Own-Supabase (BYOS)**: Client-side connection directly to personal Supabase instances with zero intermediary servers.
- [x] **Offline-First Demo Mode**: Browser LocalStorage engine with instant pre-loaded maker inventory.
- [x] **Native Canvas Image Compression**: Automatic client-side reduction of mobile camera captures (15 MB down to ~150 KB JPEG).
- [x] **Physical Barcode & QR Generation**: Standard `@media print` layout for adhesive parts-bin labels with millimeter crop marks.
- [x] **Real-Time Optical Scanner**: Back-camera autofocus scanner with targeting reticle and audio feedback.
- [x] **Hallmark Workshop Aesthetic**: Tactile buttons, constant 1px borders, and monospace `tabular-nums` numeric steppers.
- [x] **Progressive Web App (PWA)**: Workbox offline caching and mobile home screen installation.

---

## Milestone: v1.1.0 (Inventory Controls & Data Interchange)

Focus: Enhanced stock tracking and bulk data migration for larger workshops.

- [ ] **Low-Stock Threshold Alerts**: Configurable minimum stock counts per component with a dedicated low-stock filtering view.
- [ ] **CSV / TSV Import and Export**: Bulk ingestion of electronic component orders (e.g. DigiKey, Mouser, LCSC BOM exports).
- [ ] **Custom Tag Filtering**: Multi-label tagging system for components (e.g. `#smd`, `#3v3`, `#esphome`, `#through-hole`).
- [ ] **Batch Container Operations**: Bulk relocate or print labels for multiple selected containers in a single action.

---

## Milestone: v1.2.0 (Hardware Integration & Multi-User Collaboration)

Focus: Physical workshop interactions and team workspaces.

- [ ] **Web NFC Integration**: Read and write NTAG213/215 NFC stickers directly from mobile devices using Web NFC.
- [ ] **Team Workspaces via Supabase RLS**: Share storage facilities across workshop members with role-based permissions (Viewer, Editor, Admin).
- [ ] **Offline Sync Queue**: Record mutations while disconnected and replay changes to Supabase upon network reconnection.
- [ ] **Thermal Printer ESC/POS Protocol**: Direct USB/Bluetooth output for dedicated label printers (Brother QL, Phomemo, Zebra).

---

## Explicitly Out of Scope

To prevent architectural bloat and maintain privacy guarantees, the following items will not be implemented:

- **Centralized User Tracking**: ShelfMap will never integrate third-party telemetry, behavior tracking, or ad networks.
- **Enterprise Accounting / Billing**: Features such as purchase order invoicing, payroll, or tax calculations belong in dedicated ERPs, not workshop part organizers.
- **Mandatory Cloud Registration**: An offline local mode will always remain fully functional without requiring an internet connection or external account.
