---
title: "FGFR4 Inhibitor Identification for Hepatocellular Carcinoma"
date: 2026-07-15
type: research
status: published
fields:
  - oncology
  - bioinformatics
  - drug-discovery
tags:
  - FGFR4
  - HCC
  - molecular-dynamics
  - machine-learning
description: "ML/DL-driven identification of novel FGFR4 inhibitors for Hepatocellular Carcinoma using molecular docking, 100ns+ MD simulations, and cheminformatics."
featured: true
connections:
  - chronobase
  - protein-structure-notes
---

## Abstract

Fibroblast Growth Factor Receptor 4 (FGFR4) is aberrantly activated in a significant subset of Hepatocellular Carcinoma (HCC) cases, making it a compelling therapeutic target. This work presents a computational pipeline integrating machine learning, molecular docking, and extended molecular dynamics simulations to identify novel FGFR4 inhibitors.

## Introduction

Hepatocellular Carcinoma represents the most common form of primary liver cancer, accounting for approximately 75-85% of cases. The FGFR4-FGF19 signaling axis has emerged as a critical driver of hepatocyte proliferation and is overexpressed in 20-30% of HCC tumors.

$$
\Delta G_{\text{bind}} = \Delta H - T\Delta S
$$

The binding free energy calculation remains central to our scoring methodology, combining enthalpic contributions from molecular interactions with entropic penalties from conformational restriction.

## Methodology

### Virtual Screening Pipeline

The computational workflow proceeds through three stages:

1. **Pharmacophore-based filtering** — 2.3M compounds from ZINC20 filtered to ~50K candidates
2. **ML-based scoring** — Random Forest and XGBoost models trained on known FGFR4 binders
3. **Molecular docking** — AutoDock Vina scoring against FGFR4 kinase domain (PDB: 7DTC)

```python
from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors
import numpy as np

def calculate_descriptors(smiles: str) -> dict:
    """Calculate molecular descriptors for ML scoring."""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return {}
    return {
        'mw': Descriptors.MolWt(mol),
        'logp': Descriptors.MolLogP(mol),
        'hba': Descriptors.NumHAcceptors(mol),
        'hbd': Descriptors.NumHDonors(mol),
        'tpsa': Descriptors.TPSA(mol),
        'rotatable_bonds': Descriptors.NumRotatableBonds(mol),
    }
```

### Molecular Dynamics

Top-ranked complexes were subjected to 100 ns all-atom MD simulations using GROMACS 2024.3 with the CHARMM36m force field. Systems were solvated in TIP3P water with 150 mM NaCl.

## Results

Three compounds demonstrated stable binding throughout the simulation trajectory with RMSD < 2.5 Å:

| Compound | Docking Score (kcal/mol) | MM-PBSA ΔG (kcal/mol) | RMSD (Å) |
|:---------|:------------------------|:----------------------|:---------|
| AM-001   | -9.8                    | -42.3 ± 3.1           | 1.8      |
| AM-002   | -9.2                    | -38.7 ± 4.2           | 2.1      |
| AM-003   | -8.9                    | -36.1 ± 3.8           | 2.4      |

## Discussion

The identified compounds exploit a previously underutilized hydrophobic pocket adjacent to the ATP binding site, potentially offering selectivity over other FGFR family members. Further experimental validation through kinase inhibition assays and cellular proliferation studies is warranted.

## Technologies Used

- **Languages:** Python, Bash
- **Tools:** GROMACS, AutoDock Vina, PyMOL, RDKit
- **ML:** scikit-learn, XGBoost
- **Analysis:** MDAnalysis, ProLIF
