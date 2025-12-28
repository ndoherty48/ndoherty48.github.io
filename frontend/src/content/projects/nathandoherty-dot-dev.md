---
title: nathandoherty.dev
publishDate: 2025-12-27
img: /assets/projects/nathandoherty.dev.png
img_hidden: true
description: Project for hosting this site which is hosted on github pages
tags:
  - Astro
  - Personal Website
  - GitHub Pages
  - Aspire
---

## Overview

A blog and portfolio web application built with Astro, focused on delivering a fast, reliable, and accessible user experience. The application serves as a central platform to present my personal projects, technical writing, and professional background in a clean and structured format.

Leveraging Astro’s static-first architecture, the site achieves excellent performance, strong SEO, and minimal client-side JavaScript. Reusable components and a scalable content structure ensure the project remains easy to maintain and extend as content grows. Interactive features are thoughtfully integrated only where necessary to preserve speed and simplicity.

Currently leveraging the Out Of The Box stylings provided by the portfolio template.

### Tech Stack

<b>Framework:</b> Astro

<b>Astro Template:</b> Portfolio
```bash
npm create astro@latest -- --template portfolio
```
<br/>
<b>Content Management:</b> Markdown / MDX

<b>Deployment:</b> Static hosting on GitHub Pages.

### Deployment
<b>CI / CD:</b> GitHub Actions

Github Action's will trigger the deploy when there is a push to the branch `nathandoherty.dev`, which correlates with the DNS that the site will be hosted on.


Deployment Workflow:
```yml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:
  push:
    branches: [ '<branchName>' ]

# Allow this job to clone the repo and create a page deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v5
      - name: Install, build, and upload your site
        uses: withastro/action@v5
        with:
          path: ./frontend
          node-version: 24
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Links
<ul>
  <li>  
    <a href="https://github.com/ndoherty48/ndoherty48.github.io">GitHub (@ndoherty48/ndoherty48.github.io)</a>
  </li>
</ul>