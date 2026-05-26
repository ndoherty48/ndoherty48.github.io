---
title: Elite League Schedule Calendar Generator
publishDate: 2025-07-14
lastModifiedDate: 2026-05-26
img: /assets/projects/nathandoherty.dev.png
img_hidden: true
description: Generates subscribable .ICS calendar files for all 10 EIHL teams by scraping the official Elite Ice Hockey League website.
tags:
  - C#
  - .NET
  - Playwright
  - Web Scraping
  - GitHub Actions
---

## Overview

A .NET console application that scrapes fixture data from the official Elite Ice Hockey League (EIHL) website and the Champions Hockey League (CHL) website, then generates subscribable `.ICS` calendar files for each of the 10 EIHL teams. Fans can subscribe to their team's calendar in any calendar app (Google Calendar, Apple Calendar, Outlook) and automatically receive fixture updates each week.

### Motivation

The official EIHL website doesn't offer subscribable calendar feeds — fans have to manually check the Game Centre page for fixture dates and times. This means schedule changes (rearranged games, updated face-off times) are easy to miss. I built this tool to solve that problem for myself and other fans: subscribe once, and your calendar stays up to date automatically.

### How It Works

The tool uses Microsoft Playwright to navigate the EIHL Game Centre and CHL schedule pages, extracting fixture details including date, time, teams, and venue. It then produces RFC 5545-compliant iCalendar files using the `Ical.Net` library, with events categorised by competition (League, Challenge Cup, CHL).

### Competitions Covered
- Elite Ice Hockey League
  - League
  - Challenge Cup
- Champions Hockey League (for qualifying teams)

### Teams
- Belfast Giants
- Cardiff Devils
- Coventry Blaze
- Dundee Stars
- Fife Flyers
- Glasgow Clan
- Guildford Flames
- Manchester Storm
- Nottingham Panthers
- Sheffield Steelers

### Tech Stack

<b>Runtime:</b> .NET 10

<b>Language:</b> C#

<b>Browser Automation:</b> Microsoft Playwright

<b>Calendar Generation:</b> Ical.Net

<b>Hosting:</b> Microsoft.Extensions.Hosting (Generic Host)

### How It Works

1. Launches a headless Chromium browser via Playwright
2. For each team, navigates to the EIHL Game Centre and selects the current season, team, and "all months"
3. Parses fixture rows from the DOM — extracting time, game number, home/away teams, and venue
4. Optionally scrapes CHL fixtures for teams competing in European competition
5. Merges current fixtures with an archive of past seasons
6. Serialises the combined fixture list into a per-team `.ICS` file

### Challenges & Design Decisions

- **Dynamic rendering requires browser automation** — The EIHL Game Centre loads fixtures via JavaScript after dropdown selections (season, team, month). Simple HTTP scraping won't work, so Playwright drives a headless Chromium instance to interact with the page as a real user would.
- **Retry logic for flaky page loads** — The EIHL site can be slow or intermittently unresponsive. Each scrape attempt retries up to 3 times with exponential backoff to avoid failing an entire run due to a transient network blip.
- **Timezone and culture sensitivity** — Fixture times are displayed in UK local time. The workflow explicitly sets `en-GB` culture and `Europe/London` timezone to ensure date parsing is correct regardless of the runner's default locale.
- **Archive merging** — The EIHL site only shows the current season's fixtures. To keep historical events in the calendar (useful for looking back at results), the tool loads a separate archive `.ICS` file and merges it with freshly scraped data before writing the output.
- **Idempotent output** — `DtStamp` is set to the fixture's start time rather than the generation timestamp, so re-running the tool without fixture changes produces identical `.ICS` files and avoids noisy git diffs.

### Subscribing to a Calendar

Subscribe using the hosted URL (team name is PascalCase, e.g. `BelfastGiants`):

```
https://eihl-calendars.nathandoherty.dev/{TeamName}.ics
```

For example: `https://eihl-calendars.nathandoherty.dev/BelfastGiants.ics`

### Deployment

<b>CI / CD:</b> GitHub Actions

A scheduled workflow runs weekly (Sunday at 23:45 UTC) to regenerate all calendar files and commit the updated `.ICS` output back to the repository. The workflow can also be triggered manually via `workflow_dispatch`.

```yml
name: "Generate EIHL Calendar's"
on:
  workflow_dispatch:
  schedule:
    - cron: 45 23 * * 0
jobs:
  calendar-generation:
    runs-on: Windows-Latest
    steps:
      - name: Set GB Culture
        shell: pwsh
        run: Set-Culture en-GB
      - uses: actions/checkout@v4
      - name: Setup dotnet
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - name: Restore
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Install Powershell
        run: dotnet tool install -g PowerShell
      - name: Install Playwright
        working-directory: src/EliteLeagueScheduleIcsGenerator
        run: pwsh ./bin/Debug/net10.0/playwright.ps1 install --with-deps
      - name: Run Calendar Generation
        working-directory: src/EliteLeagueScheduleIcsGenerator
        run: dotnet run
        env:
          TZ: "Europe/London"
      - uses: EndBug/add-and-commit@v9
        with:
          add: Output
          message: "Update EIHL ICS with latest fixtures"
          committer_name: GitHub Actions
          committer_email: actions@github.com
```

<b>Calendar Hosting:</b> The `.ICS` files are served via GitHub Pages on a custom subdomain (`eihl-calendars.nathandoherty.dev`), backed by the raw file content in the repository's `Output/` directory.

### Future Improvements

- **API-first if one emerges** — If the EIHL ever exposes a public API, migrate away from browser scraping to reduce runtime, dependencies, and fragility.

### Links
<ul>
  <li>
    <a href="https://github.com/ndoherty48/EliteLeagueScheduleCalendarGenerator">GitHub (@ndoherty48/EliteLeagueScheduleCalendarGenerator)</a>
  </li>
  <li>
    <a href="https://eihl-calendars.nathandoherty.dev/BelfastGiants.ics">Example Calendar (Belfast Giants)</a>
  </li>
</ul>
