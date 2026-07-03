# Mathematical & Open-Source Legitimacy Guide

## 1. The Core Problem: Human Bias in Redistricting
Historically, redistricting has been manipulated to favor specific political outcomes—a practice known as gerrymandering. By hand-drawing district lines, mapmakers can "pack" and "crack" voting blocs to dilute the power of specific demographics. 

## 2. The Algorithmic Solution
To eliminate this bias, we utilize **Markov Chain Monte Carlo (MCMC)** methods, specifically the **ReCom (Recombination)** algorithm. 

Instead of drawing one map by hand, the algorithm generates thousands of legally valid, contiguous district maps. By analyzing this massive ensemble of maps, we establish a mathematically rigorous baseline of what a "fair" map looks like for any given state, given its natural political geography.

## 3. Key Metrics
- **Efficiency Gap:** Measures the number of "wasted votes" for each party. A map with an unusually high efficiency gap strongly indicates gerrymandering.
- **Compactness:** Ensures districts are geographically sensible rather than sprawling, unnatural shapes.
- **Contiguity:** Ensures all parts of a district are physically connected.

## 4. Open-Source Transparency
Because the entire methodology is open-source, the results are mathematically verifiable by anyone. The era of closed-door redistricting is over. You can audit the code, run the algorithms yourself, and compare enacted legislative maps against our algorithmic baseline.
