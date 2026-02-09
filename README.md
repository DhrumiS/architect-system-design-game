Architect — System Design Strategy Game
Overview

Architect is a frontend-only system design simulator that allows developers to visually design software architectures and receive real-time, deterministic feedback on architectural trade-offs such as latency, cost, scalability, and reliability.

The application is designed as a strategy game for developers, focused on learning and optimization rather than code execution.

Purpose

This project demonstrates advanced frontend engineering by modeling complex system-design concepts entirely in the browser, with a strong emphasis on UI/UX, state management, and deterministic simulation logic.

Key Features

Scenario-based system design simulation

Drag-and-drop architecture canvas

Component configuration with immediate feedback

Real-time metrics calculation

Architecture scoring system (0–100)

Anti-pattern detection and warnings

Build saving and comparison

Dark-mode, developer-tool-style UI

Scenarios

Architect provides exactly three predefined scenarios:

Chat — latency-sensitive, high concurrency

E-commerce — balanced cost, reliability, and scalability

Analytics — throughput and data processing focused

Each scenario applies different metric weightings and constraints.

Architecture Components

Users can build architectures using the following components:

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

Each component configuration directly affects system metrics.

Metrics Engine

The Metrics Engine evaluates architectures in real time using deterministic formulas.

Metrics Calculated

Latency — milliseconds

Cost — relative units

Scalability — percentage score

Reliability — percentage score

Architecture Score

Numerical score between 0 and 100

Weighted based on selected scenario priorities

Updated within 100ms on any architecture change

Anti-Pattern Detection

The system identifies common architectural mistakes, including:

Missing cache in read-heavy scenarios

Monolithic backend in high-scale scenarios

Excessive component hops increasing latency

Warnings:

Are visually distinct

Do not block progress

Automatically resolve when corrected

User Flow

Select a scenario

Build architecture on the canvas

Configure components

View real-time metrics and warnings

Optimize design

Save and compare builds

Build Management

Save architecture designs as Builds

Persist builds in browser localStorage

Load previously saved builds

Compare up to three builds side-by-side

Highlight the highest-scoring architecture

UI / UX Principles

Dark mode by default

Developer-tool aesthetic

High information density with clear hierarchy

Smooth animations (150–300ms)

Accessible contrast and typography

Technology Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Zustand

React Flow

Recharts

Framer Motion

Data & Storage

Browser localStorage only

Backend

None (fully client-side)

Constraints

No backend services

No external APIs

Fully deterministic simulation

Offline-capable after initial load

No authentication or user accounts

Project Structure
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

What This Project Demonstrates

Complex frontend state modeling

Interactive data visualization

Deterministic simulation logic

High-density UI/UX design

Product-level system thinking

License

MIT
