# BUG-002 Customer can view another customer's complete order

**Jira issue type:** Bug  
**Module:** Order details API / authorization  
**Environment/build:** Local API; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Client:** Newman API regression  
**Severity / priority:** Critical / P0  
**Related requirement and test:** ORD-03; TC-ORD-005; Postman `Block access to another customer's order`  

## Preconditions

John and Jane exist. John owns an order and its identifier is known. Jane is
authenticated as a normal customer.

## Steps to reproduce

1. Authenticate as John with `POST /api/users/auth`.
2. Create an order with `POST /api/orders` and record its `_id`.
3. Log out John with `POST /api/users/logout`.
4. Authenticate as Jane with `POST /api/users/auth`.
5. Send `GET /api/orders/{johnOrderId}` using Jane's session.

## Expected result

The API returns HTTP 403 (or 404 to avoid confirming the resource) and does not
return any of John's order or customer information.

## Actual result

The API returns HTTP 200 with the complete order, including items, shipping
address, totals, payment/delivery state, and the owner's name and email.

## Reproducibility

1/1 collection run against a freshly seeded database.

## Impact

Any authenticated customer who obtains or guesses a valid order identifier can
read another customer's personal and purchase information. This is an insecure
direct object reference / broken object-level authorization issue.

## Evidence

- `reports/newman-results.json` (sanitize personal fixture data before sharing)
- Failed assertions: `Foreign order is forbidden` and `Foreign order details are not disclosed`
- Run date: 2026-09-26

## Suggested correction

After loading the order, allow access only when `order.user._id` matches the
authenticated user's ID or `req.user.isAdmin` is true. Add API regression tests
for owner, second customer, administrator, unauthenticated user, and unknown ID.
