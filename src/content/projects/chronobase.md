---
title: "ChronoBase"
date: 2026-08-01
type: project
status: in-progress
fields:
  - chronobiology
  - drug-discovery
  - ai
tags:
  - ChronoBase
  - circadian-rhythm
  - chronotherapeutics
  - platform
description: "A platform for optimizing medication timing — when drugs work best, not just which drugs work — using circadian data and AI."
featured: true
connections:
  - fgfr4-hcc-discovery
  - why-biological-time-matters
---

## Overview

ChronoBase is a computational platform that integrates circadian biology data with pharmacokinetic models to predict optimal drug administration timing. The core hypothesis: **the same drug, at the same dose, can have dramatically different efficacy and toxicity profiles depending on when it's administered.**

## The Problem

Most drug dosing schedules are determined by pharmacokinetic half-life alone. This ignores the ~40% of protein-coding genes that exhibit circadian oscillation, including drug targets, metabolic enzymes, and transport proteins.

## Architecture

```
┌─────────────────────────────────────────┐
│           ChronoBase Platform           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌───────────────┐   │
│  │  Circadian   │    │  Pharmacology  │  │
│  │  Data Layer  │───▶│  Engine        │  │
│  │  (CircaDB,   │    │  (PK/PD +      │  │
│  │   JTK_CYCLE) │    │   Clock Genes) │  │
│  └─────────────┘    └───────┬───────┘   │
│                             │           │
│                    ┌────────▼────────┐  │
│                    │  Timing         │  │
│                    │  Optimizer      │  │
│                    │  (ML Ensemble)  │  │
│                    └────────┬────────┘  │
│                             │           │
│                    ┌────────▼────────┐  │
│                    │  Recommendation │  │
│                    │  API            │  │
│                    └─────────────────┘  │
└─────────────────────────────────────────┘
```

## Current Status

- [x] Circadian gene expression database aggregation
- [x] JTK_CYCLE rhythmicity detection pipeline
- [ ] PK/PD model integration
- [ ] ML-based timing optimization
- [ ] API development
- [ ] Clinical validation dataset

## Technologies

- **Backend:** Python, FastAPI
- **ML:** PyTorch, scikit-learn
- **Bioinformatics:** BioPython, Scanpy
- **Data:** CircaDB, GTEx, ENCODE
- **Infrastructure:** Docker, PostgreSQL
