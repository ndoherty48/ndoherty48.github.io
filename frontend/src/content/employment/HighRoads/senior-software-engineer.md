---
title: Senior Software Engineer
employer: HighRoads
startDate: 2023-04-01
img: /assets/employment/highroads.jpg
img_alt: Logo of employer HighRoads.
description: Senior Software Engineer @ HighRoads
tags:
  - C#
  - .NET
  - AWS
  - ECS
  - Lambda
  - Terraform
  - OpenTelemetry
  - Amazon Bedrock
  - MCP
  - Aspire
---

## Summary

Senior Software Engineer contributing to architectural decisions, platform modernisation, and developer experience improvements across a benefits administration platform. Responsible for driving migration from legacy .NET Framework services to modern cloud-native architectures on AWS.

## Responsibilities

- Part of an Architecture Governance group that reviews tools and approaches for upcoming features
- Mentor junior engineers and students, guiding them toward finding their own solutions rather than handing them answers
- Experiment with new technologies to evaluate improvements to the platform or developer experience, such as Aspire for running distributed systems locally with unified logs, traces, and metrics

## Key Achievements

- Migrated .NET Framework API endpoints to **.NET 10 Clean Architecture** container applications hosted in **ECS with autoscaling**, and serverless Lambdas using latest .NET best practices
- Replaced JFrog Artifactory with **AWS CodeArtifact**, saving **thousands of dollars per year** on infrastructure and licensing costs by replacing two instances (pre-prod and prod) with a serverless solution
- Migrated observability from **New Relic to OpenTelemetry** with Prometheus and Grafana on AWS, standardising the DI registration in a shared NuGet package
- Built an **MCP server in C#** to allow LLMs to interact with internal GET endpoints
- Explored **AI use cases** with Amazon Bedrock and Microsoft Semantic Kernel
- Standardised .NET applications by building **NuGet packages** for authentication, API clients, and custom project templates for bootstrapping new Web APIs and Lambdas
- Built authentication flow for read-only Aurora Postgres using **IAM SSO credentials**, enabling short-lived access without shared passwords
- Collaborated with the Director of Cloud Architecture to build an **interactive CLI** (using .NET and Spectre Console) that unifies service creation, infrastructure provisioning, and deployment. Designed to be consumed by LLMs through MCP or Skills

## Tech Stack

- **Languages:** C#, Java, TypeScript
- **Frontend:** React, Blazor
- **Backend:** .NET 10, ASP.NET Core, Lambda, Clean Architecture
- **Infrastructure:** AWS (ECS, Lambda, Aurora Postgres, CodeArtifact, Bedrock), CloudFormation, Docker
- **Tools:** OpenTelemetry, Prometheus, Grafana, Spectre Console, Aspire, Semantic Kernel, MCP
