# Exploratory Testing Charters

Use 30-minute sessions. Record tester, build, environment, data used, notes,
questions, defects, and evidence beneath each charter or in a dated session file.

## EX-01: Cart and identity transitions

Explore how cart and shipping data behave across refresh, logout, login as a
different customer, browser back/forward, duplicated tabs, and expired sessions.
Focus on privacy, stale state, accidental order placement, and calculation drift.

## EX-02: Search and navigation resilience

Explore empty, whitespace-only, mixed-case, very long, encoded, punctuation,
and partial search terms. Combine search with pagination, back navigation, direct
URLs, and refresh. Watch for errors, lost state, confusing feedback, and delays.

## EX-03: Checkout interruption

Interrupt checkout at each step by refreshing, revisiting prior steps, changing
cart contents in another tab, logging out, and using direct URLs. Look for skipped
requirements, duplicate orders, stale totals, and misleading progress indicators.

## EX-04: Authorization and object ownership

As guest, customer, second customer, and admin, explore direct UI routes and API
resources for profiles, users, products, and orders. Change identifiers and HTTP
methods. Look for data exposure and unauthorized mutation.

## EX-05: Input quality and error recovery

Explore names, addresses, comments, and admin product fields using leading and
trailing spaces, Unicode, long strings, negative/zero values, decimals, markup,
and rapid repeat submission. Observe validation, stored data, duplicate actions,
error clarity, and recovery without reload.
