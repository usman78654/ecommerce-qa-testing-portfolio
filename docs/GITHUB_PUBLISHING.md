# GitHub Publishing Guide

The portfolio root is ready for GitHub, but `proshop/` still contains the
upstream clone's `.git` directory. Remove only that nested metadata immediately
before initializing the portfolio repository; application files are unaffected.

## Prepare the repository

Run from the portfolio root after closing tools that may be using Git:

```powershell
$expected = (Resolve-Path .\proshop\.git).Path
if ($expected -ne (Join-Path (Get-Location) 'proshop\.git')) {
  throw "Unexpected nested Git path: $expected"
}
Remove-Item -LiteralPath $expected -Recurse -Force
git init -b main
git add .
git commit -m "feat: publish evidence-driven e-commerce QA portfolio"
```

The current Codex workspace helper could not operate while both parent and nested
Git metadata were being changed, so repository initialization is deliberately
left for the publishing step. The upstream URL and baseline commit are recorded
in the README and Attribution file.

## Recommended GitHub settings

- Description: `Evidence-driven e-commerce QA portfolio: manual, API, browser, accessibility, performance, and CI testing.`
- Topics: `software-testing`, `manual-testing`, `postman`, `playwright`, `accessibility`, `performance-testing`, `qa-portfolio`
- Default branch: `main`
- Enable Actions and issue templates.
- Do not publish `.env`, raw Newman JSON, cookies, password hashes, or real user data.

## Publish

Create an empty GitHub repository, then follow the commands GitHub provides to
add the remote and push `main`. After the first push, run the `QA Portfolio`
workflow manually and attach its artifact link to the README if desired.
