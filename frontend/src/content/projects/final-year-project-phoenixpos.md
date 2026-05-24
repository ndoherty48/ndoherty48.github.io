---
title: Final Year Project - Phoenix POS
publishDate: 2021-05-02
img: /assets/projects/final-year-project-phoenixpos.png
img_hidden: true
img_alt: Iridescent ripples of a bright blue and pink liquid
description: Design of a Point of Sale system using Web Technologies, for BSc Computer Science Final Year Project.
tags:
  - Java
  - React
  - AWS
  - PACT Testing
  - AWS CDK
  - PostgreSQL

---

## Overview

PhoenixPOS is a multi-tenant, cloud-hosted Point of Sale system built as my BSc Computer Science final year project at Ulster University. The system enables retail businesses to process in-store transactions, manage inventory, oversee employees, and track revenue analytics — all through a browser-based interface.

The project is split across four repositories forming a complete SaaS platform:

- **Terminal Client** — a React PWA designed for iPad-sized checkout terminals, supporting barcode scanning, cart management, cash checkout, and offline transaction queuing via IndexedDB
- **Management Client** — a React back-office console for store managers to handle employee CRUD, stock/inventory management, promotions, branch administration, terminal session oversight, and revenue analytics
- **Server API** — a reactive Spring Boot (WebFlux + R2DBC) backend serving both clients with RESTful endpoints
- **Infrastructure** — AWS CDK stacks, Ansible playbooks, database scripts, and performance tests

Key design decisions included building the terminal client as an offline-first PWA (transactions queue locally and bulk-upload when connectivity returns), using reactive/non-blocking I/O on the API for scalability, and implementing contract testing between the clients and API to enable independent deployments.

*This was built early in my AWS journey, and the architecture reflects that — it runs in the cloud rather than being truly cloud-native. If I were building it today, I'd design around managed services and serverless patterns rather than self-managing infrastructure on EC2. That said, it was a great learning experience in stitching together a full production system end-to-end.*

## Implementation

### Development

The backend is a **Spring Boot 2.3.5** application running on **Java 11** with **Spring WebFlux** and **R2DBC** for fully reactive, non-blocking database access against PostgreSQL. The API is structured into clear layers — domain models (Lombok POJOs), reactive repositories (`ReactiveCrudRepository`), and controllers split by client concern (`/api/pos/*` for terminals, `/api/management/*` for the back-office).

Authentication uses **AWS Cognito** with two separate User Pools (one per client type). An interceptor layer validates Bearer tokens, caches auth state in-memory with a 1-hour TTL, and injects the authenticated entity (Branch or Employee) as a request attribute. Secrets (DB credentials, mail config, SSL certs) are managed by **HashiCorp Vault** running on a private-subnet EC2 instance, with password rotation on every deployment.

Both frontend clients are **React 16** apps using **Recoil** for state management and **React Router v5**. The Terminal Client adds **Tailwind CSS** (optimised for iPad viewports), **IndexedDB** for offline storage, and a service worker for PWA capabilities. The Management Client uses **React Bootstrap** for its UI and includes revenue line graphs, permission-gated routes, and multi-step registration forms.

The PostgreSQL schema covers 10 tables (stores, branches, employees, products, suppliers, terminals, transactions, sessions, promotions, and permissions) with foreign key relationships and a dedicated application user restricted to DML operations only.

### Testing

Testing spans multiple strategies across the stack:

- **Unit Tests** — JUnit 5 + Mockito for all API controllers and utilities, with an in-memory H2 database standing in for PostgreSQL during tests
- **Contract Testing (PACT)** — the Terminal Client publishes consumer contracts to **Pactflow**, covering all API interactions (products, promotions, employees, terminal registration, sessions, transactions) with both authorised and unauthorised variants. The Server API runs provider verification against these contracts in CI, ensuring the two can be deployed independently without breaking integration
- **BDD (Cucumber)** — feature files covering management authentication flows and dashboard analytics scenarios
- **Performance Testing** — Apache JMeter suites (load, stress, and soak tests) run on the deployed infrastructure, with results committed back to the repo
- **Code Coverage** — JaCoCo configured on the API (excluding domain/config packages)

### Hosting

The system runs on **AWS (us-east-1)** with infrastructure defined in **AWS CDK (Python)**:

- A custom **VPC** (`10.1.0.0/16`) with public and private subnets across 2 AZs
- An **EC2 application instance** (public subnet) running Apache as a reverse proxy — serving both React clients as static sites and proxying API requests to the Spring Boot JAR running as a systemd service
- An **EC2 Vault instance** (private subnet) providing secrets management with S3 backend storage
- **RDS PostgreSQL** (private subnet) for the database, with credentials rotated via Vault on each deployment
- **S3 buckets** for infrastructure scripts, application logs, and product images
- **Elastic IP** for stable DNS, with **Let's Encrypt** SSL certificates via Certbot

Deployment is automated through **Ansible playbooks** triggered by EC2 UserData on initial provisioning and by an hourly cron job that polls GitHub Releases for new versions. The CI/CD pipeline uses **GitHub Actions** across all repos — linting Ansible playbooks, running tests with Pact contract publishing, auto-merging integration branches, version bumping, and creating tagged releases with build artifacts attached. Infrastructure changes are deployed manually via a `cdk deploy` workflow dispatch.
