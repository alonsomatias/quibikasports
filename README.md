Test folder has the spec files split into feature.
Each test picks function from the pages files into the "pom" folder, 
so we can have reusable methods and all the locators are responsibility of each page file.

Use "npx playwright test" to excecute all test case in headless mode, or add "--ui" parameter to excecute the ui mode.
When the execution ends, use "npx playwright show-report" to see the results.

Failed test cases will be run again at leat 3 times.
If there is some flaky test cases, we're not consider that as a total failure, but we should make some improvements on that functionality.