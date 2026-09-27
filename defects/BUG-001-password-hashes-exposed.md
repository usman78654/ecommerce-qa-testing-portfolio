# BUG-001 Admin user-list API exposes password hashes

**Jira issue type:** Bug  
**Module:** User administration API  
**Environment/build:** Local API; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Client:** Newman API regression  
**Severity / priority:** High / P1  
**Related requirement and test:** ADM-03; Postman `Admin lists users`  

## Preconditions

The dedicated QA database is seeded and an administrator is authenticated.

## Steps to reproduce

1. Authenticate with `POST /api/users/auth` as the seeded administrator.
2. Send `GET /api/users` with the administrator session cookie.
3. Inspect each object in the JSON array.

## Expected result

The response includes fields needed for user administration and excludes all
password credentials and hashes.

## Actual result

The API returns HTTP 200 and each user object contains a `password` property
holding a bcrypt password hash.

## Reproducibility

1/1 collection run against a freshly seeded database.

## Impact

Anyone with access to this admin endpoint can retrieve every stored password
hash. Exposure increases the impact of a compromised administrator session and
enables offline password cracking. Plaintext passwords were not exposed.

## Evidence

- `reports/newman-results.json` (sanitize response bodies before external sharing)
- Failed assertions: `Response does not expose a password` and `Users exclude passwords`
- Run date: 2026-09-26

## Suggested correction

Return `User.find({}).select('-password')` or an explicit safe projection, then
add a regression assertion that every returned user lacks `password`.
