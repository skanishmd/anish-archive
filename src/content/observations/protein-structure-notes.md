---
title: "Notes on Protein Structure Analysis"
date: 2026-07-20
type: observation
status: published
fields:
  - bioinformatics
  - structural-biology
tags:
  - protein-structure
  - PyMOL
  - AlphaFold
  - learning-notes
description: "Working notes on structural analysis techniques — from PDB parsing to pLDDT interpretation to binding site identification."
featured: false
connections:
  - fgfr4-hcc-discovery
---

## PDB File Anatomy

A PDB file is deceptively simple. Each ATOM record contains:

```
ATOM      1  N   ALA A   1      27.340  24.430   2.614  1.00  9.67           N
```

- Columns 1-6: Record type
- Columns 7-11: Atom serial number
- Columns 13-16: Atom name
- Columns 18-20: Residue name
- Column 22: Chain identifier
- Columns 23-26: Residue sequence number
- Columns 31-54: X, Y, Z coordinates (Å)
- Columns 55-60: Occupancy
- Columns 61-66: B-factor (or pLDDT for AlphaFold)

## Interpreting AlphaFold Confidence

AlphaFold stores its confidence metric (pLDDT) in the B-factor column:

| pLDDT Range | Interpretation | Color (PyMOL) |
|:------------|:---------------|:--------------|
| > 90        | Very high confidence | Dark blue |
| 70–90       | Confident | Light blue |
| 50–70       | Low confidence | Yellow |
| < 50        | Very low / disordered | Orange |

Disordered regions (pLDDT < 50) are often intrinsically disordered regions (IDRs) or flexible loops — not modeling failures.

## Binding Site Identification

Three complementary approaches:

1. **Ligand proximity** — identify residues within 4-5 Å of a co-crystallized ligand
2. **Conservation mapping** — ConSurf analysis to find evolutionarily conserved surface patches
3. **Geometric detection** — fpocket / SiteMap to find druggable cavities

```python
from Bio.PDB import PDBParser, NeighborSearch

def find_binding_site(pdb_file: str, ligand_chain: str, ligand_resname: str, cutoff: float = 5.0):
    """Find residues within cutoff distance of a ligand."""
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure('protein', pdb_file)
    
    ligand_atoms = []
    protein_atoms = []
    
    for atom in structure.get_atoms():
        res = atom.get_parent()
        if res.get_resname() == ligand_resname:
            ligand_atoms.append(atom)
        elif res.id[0] == ' ':  # Standard residue
            protein_atoms.append(atom)
    
    ns = NeighborSearch(protein_atoms)
    binding_residues = set()
    
    for atom in ligand_atoms:
        nearby = ns.search(atom.get_vector().get_array(), cutoff)
        for nearby_atom in nearby:
            res = nearby_atom.get_parent()
            binding_residues.add((res.get_resname(), res.id[1]))
    
    return sorted(binding_residues, key=lambda x: x[1])
```
