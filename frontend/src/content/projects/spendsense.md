---
title: SpendSense
publishDate: 2026-06-01
img: /assets/projects/spendsense.png
img_hidden: true
description: A cross-platform personal budgeting app built with .NET MAUI Blazor Hybrid and Aspire
tags:
  - .NET MAUI
  - Blazor Hybrid
  - Aspire
  - SQLite
  - MudBlazor
  - EF Core
  - Cross-Platform
---

## Overview

SpendSense is a personal budgeting application built with .NET MAUI Blazor Hybrid, designed to run across iOS, Android, Mac Catalyst, and Windows from a single codebase. The app takes a local-first approach with SQLite for offline data storage, while using Aspire for multi-device development orchestration.

The app provides comprehensive budget tracking with intelligent features like predictive overspend warnings, category auto-suggestion, and automated recurring transaction generation — all running on-device without requiring a backend.

### Features

- **Transaction Management** — record income, expenses, and savings with categories, currencies, and notes
- **Recurring Transactions** — auto-generates transactions on app launch (salary, subscriptions, rent)
- **Monthly Budgets** — per-category spending limits with copy-to-next-month templates
- **Savings Goals** — targets with auto-calculated progress from linked category transactions
- **Dashboard** — monthly summary with pie chart, spending breakdown, overspend warnings, and month-over-month comparison
- **Spending Trends** — dedicated page with configurable line and bar charts over 3/6/12 months
- **Predictive Warnings** — linear projection alerts when spending pace will exceed budget
- **Category Auto-Suggestion** — learns from transaction history to pre-select categories
- **Local Notifications** — budget threshold alerts (80%/100%) and goal milestones (50%/100%)
- **Privacy Mode** — hide all monetary values with a single toggle
- **Dark Mode** — persisted theme preference
- **Income Attribution** — configurable setting for whether income funds the current or next month's budget

### Tech Stack

<b>Framework:</b> .NET 10 / C# with MAUI Blazor Hybrid

<b>UI Library:</b> MudBlazor 9

<b>Database:</b> SQLite via Entity Framework Core (local-first, offline-capable)

<b>Orchestration:</b> Aspire with dev tunnels for multi-device debugging

<b>Notifications:</b> Plugin.LocalNotification

<b>Architecture:</b> Repository pattern, SaveChanges interceptors for timestamps, Preferences API for settings

### Architecture Decisions

- **Local-first with SQLite** — works fully offline, no server dependency, data stays on device
- **Repository pattern** — thin layer over DbContext for testability and separation of concerns
- **Enum-to-string storage** — enums stored as readable strings in SQLite for debuggability
- **Recurring transaction generation** — runs synchronously on app startup after migrations
- **Notification deduplication** — uses Preferences to track notified thresholds, preventing repeat alerts across app restarts

### Project Structure

```
SpendSense/
├── App/SpendSense/              # MAUI Blazor app
│   ├── Common/
│   │   ├── Data/                # DbContext, repositories, interceptors
│   │   ├── Models/              # Entity models and enums
│   │   ├── Interfaces/          # Shared interfaces
│   │   └── Services/            # SettingsService, RecurringTransactionGenerator, NotificationService
│   ├── Components/
│   │   ├── Layout/              # MainLayout, NavMenu
│   │   └── Pages/               # All page components (CRUD, Dashboard, Settings, Trends)
│   ├── Migrations/              # EF Core migrations
│   └── MauiProgram.cs           # App startup and DI
├── Infra/
│   ├── SpendSense.AppHost/      # Aspire orchestration
│   └── SpendSense.ServiceDefaults/ # Shared service configuration
└── ROADMAP.md                   # Future plans
```

### Future Roadmap

- Bank statement CSV/PDF import with auto-categorisation
- Receipt photo attachments with OCR
- Monthly summary reports
- API backend (AWS Lambda + DynamoDB + Cognito) for cloud sync
- Web companion app via Blazor Server

### Links
<ul>
  <li>
    <a href="https://github.com/ndoherty48/SpendSense">GitHub (@ndoherty48/SpendSense)</a>
  </li>
</ul>
