Installing Playwright

`npm init playwright@latest`

Running Test with command line

`npx playwright test`

Run test in UI mode

`npx playwright test --ui`

Run test in headed mode

`npx playwright test --headed`

Run test on different browser

`npx playwright test --project webkit`
`npx playwright test --project webkit --project firefox`

Run specific test
To run a single test file, pass in the name of the test file that you want to run.

`npx playwright test landing-page.spec.ts`

To run a set of test files from different directories, pass in the names of the directories that you want to run the tests in.

`npx playwright test tests/todo-page/ tests/landing-page/`

To run files that have landing or login in the file name, simply pass in these keywords to the CLI.

`npx playwright test landing login`

To run a test with a specific title, use the -g flag followed by the title of the test.

`npx playwright test -g "add a todo item"`

Run last failed tests
To run only the tests that failed in the last test run, first run your tests and then run them again with the --last-failed flag.

`npx playwright test --last-failed`

Debug tests with the Playwright Inspector

`npx playwright test --debug`

To debug one test file

`npx playwright test example.spec.ts --debug`

To debug a specific test from the line number

`npx playwright test example.spec.ts:10 --debug`

Test Report

`npx playwright show-report`

