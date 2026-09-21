# Bug reporting

Use [Issues > New issue > Bug report](https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright/issues/new?template=bug-report.yml)
to record a reproducible problem or an unresolved failure that needs investigation.
The form becomes available after it is merged into the default branch.

The report captures the affected scenario, environment, reproduction steps,
expected and actual results, frequency, proposed severity, impact, and evidence.
Reports are submitted manually after reviewing the available evidence.

## Investigate a failed test

1. Open the HTML report and identify the failing test, browser project, and step.
2. Review the assertion, screenshot, video, and trace when available. For an
   accessibility failure, inspect the attached Axe results and affected elements.
3. Save the relevant evidence before rerunning: Playwright replaces generated
   output and the latest HTML report on subsequent runs.
4. Reproduce the affected scenario with the same data and browser. Note whether
   it also occurs manually and whether it fails consistently.
5. Check existing issues. Add evidence to a matching issue or submit one report
   for the underlying problem, listing every affected browser.

Start with Needs investigation when the cause is unclear. A failure can come from
the application, an incorrect assertion or locator, test data, configuration, or
service availability. Passing on retry does not explain the original failure.

SauceDemo includes intentionally problematic demo accounts. Record the account
used and check its intended behaviour before treating the result as a new defect.

## Collect local evidence

Open the latest report from the project root:

```bash
npm run report
```

After saving the original evidence, rerun only the affected test. For example:

```bash
npx playwright test tests/login/login.spec.ts --project=chromium --grep 'standard user can log in successfully' --retries=0
```

Replace the file, browser project, and title filter with those from the failure.
Add `--headed` if watching the browser helps investigation.

The configured diagnostics are:

| Evidence    | Behaviour                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------- |
| Screenshot  | Captured for a failed test when the page is available                                         |
| Video       | Retained for a failed test when a browser recording is available                              |
| Trace       | Recorded for each attempt and retained when that attempt fails, including the initial attempt |
| HTML report | Contains test results and available attachments                                               |
| Axe JSON    | Attached by the accessibility tests for inspecting scan results                               |

Traces now work for local failures even though local retries are disabled.
Recording traces adds execution overhead; traces from passing attempts are
discarded. Errors before the browser or test starts may only have console logs.

Generated output is stored in `test-results/` and `playwright-report/` and remains
excluded from Git. Inspect traces through the report's Trace Viewer link.

Collect the test-repository revision and tool versions with:

```bash
git rev-parse HEAD
npx playwright --version
node --version
```

The repository commit identifies the test code, not the deployed SauceDemo build.
Record the application build separately if it is available; otherwise say unknown.

## Collect CI evidence

1. Open the relevant run under GitHub Actions and copy its URL.
2. Read the `test` job's failing step and note the test title and browser project.
3. Download the `playwright-report` artifact, if it was produced, and extract it.
4. From the project root, run `npx playwright show-report /path/to/extracted/report`,
   replacing the path with the folder containing the report's `index.html`.
5. Include the run URL, artifact name, affected test, and a short error excerpt in
   the issue. Attach the specific evidence needed to understand the problem.

CI report artifacts are retained for 30 days. Preserve relevant reviewed evidence
with a longer-lived issue before the artifact expires. A failure during dependency
installation or code-quality checks may occur before any Playwright report exists.

This is a public repository. Review screenshots, videos, traces, URLs, and logs
before sharing; remove private credentials, session tokens, and personal data.

## Triage and resolution

- Severity describes the impact; priority describes how soon the team should fix
  the problem. Record the reason for the severity and agree priority during triage.
- Separate confirmed observations from a suspected cause. Keep unrelated failures
  in separate issues and link duplicates rather than creating one per CI retry.
- Link a framework fix to its issue in the pull request. Retest the original
  scenario and relevant regression coverage before closing it as fixed.
- SauceDemo application defects can be documented here as portfolio findings.
  This repository cannot change SauceDemo itself; close those findings when there
  is evidence of resolution or explain another closure reason.
