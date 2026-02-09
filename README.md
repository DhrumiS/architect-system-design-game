Architect — System Design Strategy Game

Architect is a frontend-only system design simulator that lets developers design software architectures visually and receive real-time feedback on architectural trade-offs such as latency, cost, scalability, and reliability.

It is built as a strategy game for developers, not a toy project.

🚀 Why Architect Exists

Most frontend projects demonstrate CRUD and UI rendering.
Architect demonstrates something harder:

Modeling complex systems in the browser

Translating abstract system-design concepts into visual feedback

Designing high-density, decision-driven UI/UX

Managing non-trivial client-side state and deterministic logic

This project is intended as a portfolio hero project.

🧠 What the App Does

User selects a real-world scenario

Chat

E-commerce

Analytics

User builds an architecture by:

Dragging components onto a canvas

Connecting components

Configuring component types

The system continuously evaluates the design and shows:

Latency (ms)

Cost (relative units)

Scalability (%)

Reliability (%)

Overall Architecture Score (0–100)

The app detects architectural anti-patterns and shows warnings.

Users can save and compare multiple architecture builds.

All logic runs entirely in the browser.

🎮 Core Gameplay Loop
Select Scenario
   ↓
Build Architecture
   ↓
See Metrics & Warnings
   ↓
Optimize Design
   ↓
Save & Compare Builds


This loop runs continuously with real-time feedback.

🧩 Architecture Components

The following components can be added to the canvas:

Frontend

SPA

SSR

CDN

Backend

Monolith

Microservices

Database

SQL

NoSQL

Cache

Redis

None

Queue

Kafka

None

Authentication

JWT

OAuth

Each configuration affects metrics deterministically.

📊 Metrics & Scoring

The Metrics Engine calculates:

Latency
Based on component hops, architecture depth, and configuration overhead

Cost
Relative infrastructure cost based on selected components

Scalability
Ability to handle increased traffic for the selected scenario

Reliability
Penalties for single points of failure and missing redundancy

Architecture Score

A weighted score (0–100) is calculated based on scenario priorities.
Weights differ per scenario (e.g. latency-heavy vs cost-sensitive).

There is no randomness in scoring.

⚠️ Anti-Patterns

The system detects common architectural mistakes, such as:

High-scale scenario without caching

Monolithic backend under heavy traffic

Excessive hop count causing high latency

Warnings:

Are visually distinct

Do not block progress

Disappear when the issue is resolved

🧑‍🎓 Beginner-Friendly, Expert-Deep

Tooltips explain each component and option

Contextual help for configuration choices

Example architectures available per scenario

Advanced users can inspect calculation logic

The UI progressively reveals complexity.

🛠 Tech Stack

Frontend Only

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Zustand (state management)

React Flow (architecture canvas)

Recharts (metrics visualization)

Framer Motion (animations)

Storage

Browser localStorage

Backend

None

🎨 UI / UX Principles

Dark mode by default

Developer-tool aesthetic

High information density without clutter

Smooth animations (150–300ms)

Clear visual hierarchy and spacing

Designed to feel like DevTools × Strategy Game.

📦 Project Structure (High Level)
/app
  /scenarios
  /builder
  /compare
/components
  /canvas
  /metrics
  /controls
  /ui
/lib
  scoring.ts
  models.ts
  constants.ts
/store
/hooks

🧪 Constraints (Intentional)

No backend or APIs

Fully deterministic behavior

Works offline after initial load

No authentication

No AI-generated decisions

These constraints are intentional to keep the focus on frontend engineering and UX.

📈 What This Project Demonstrates

Advanced frontend state modeling

Complex UI interaction design

Deterministic simulation logic

Performance-aware rendering

Product-level UX thinking

📌 Status

This project is actively developed as a portfolio showcase.

📄 License

MIT
