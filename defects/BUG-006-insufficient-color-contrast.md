# BUG-006 Text and controls fail minimum color-contrast checks

**Jira issue type:** Bug  
**Module:** Global visual accessibility  
**Environment/build:** Chrome + axe-core; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Severity / priority:** Medium / P2  
**Standard:** WCAG 1.4.3 Contrast (Minimum)  

## Preconditions

The application uses its default theme and the automated axe scan runs at
desktop size.

## Steps to reproduce

1. Run axe WCAG 2.0/2.1 A/AA rules on Home, Login, Register, Cart, and Product Detail.
2. Review `color-contrast` results and highlighted nodes.

## Expected result

Normal text meets at least 4.5:1 contrast and large text meets at least 3:1,
subject to WCAG exceptions.

## Actual result

axe reports 65+ affected text/control nodes across all five scanned pages. The
affected elements include muted navigation/text colors and themed controls.

## Reproducibility

Reproduced on all 5/5 scanned pages. Exact affected-node counts are retained in
the JSON evidence because repeated components appear on several pages.

## Evidence

- `evidence/accessibility/2026-09-27/axe-results.json`
- Page screenshots under `evidence/accessibility/2026-09-27/`

## Suggested correction

Update the theme color tokens and retest each affected foreground/background
combination. Confirm with axe and manual inspection at normal and high zoom.
