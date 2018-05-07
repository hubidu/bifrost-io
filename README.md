e2e-dashboard-client
====================

Client library to send E2E reports to a dashboard service for visualization

## TODO

- DONE Reverse screenshot order (actually report app should order by time)
- DONE report-app: Filter by token and project
- DONE Add project id
- DONE Specify token for report data upload
- DONE Show a url to the dashboard after test execution
- DONE Speed up test import
- DONE Extract User Agent info
- DONE Implement element highlighting
- DONE Filter commands without screenshot?
- DONE Add a runId
- Extract tags from test title
- Add more error details (actual/expected)
- Improve error messages
- Make html snapshot
- Make server report processing more robust
- Test with real project
- Enable logging json or markdown to provide additional information (e. g. links to items)
- Autowait for elements
- Implement scenario outline


## Usage with codeceptjs

Include it as helper in your codeceptjs project (see examples directory). Then run your tests
specifying the reporter host as environment variable, like so:

```
    cross-env OWNER_KEY=12345 TEST_PROJECT=codeceptjs-demo DASHBOARD_HOST=localhost:8000 codeceptjs run
```