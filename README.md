Preconditions: 
- Node.js

Installation:
  1. `git clone https://github.com/gpenev/sheets-player.git`
  2. Enter the `sheets-player` folder
  3. Run `npm install`

Run a test: `npx playwright test Tests/ExampleTest.spec.js --headed`
  - `--headed` is for watching the execution in the browser. The test will run headless without it.
  - To run a test for e specific project, if there are several projects for different environments:
    
     `npx playwright test --project=Project_Example Tests/ExampleTest.spec.js`

View HTML Test Report: `npx playwright show-report`

`dotenv` module is included in case environment variables are needed. Create a `.env` file in the root folder.  

