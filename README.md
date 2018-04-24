e2e-dashboard-client
====================

Client library to send E2E reports to a dashboard service for visualization

## TODO

DONE codeceptjs: Get step stacktrace
DONE Get device information
DONE Add error screenshot
DONE zip report dir
DONE Push report files and screenshots to the dashboard service
- Reverse screenshot order (actually report app should order by time)
- report-app: Filter by token and project
- Add project id
- Extract tags from test title
- Specify token for report data upload
- Implement scenario outline
- Implement element highlighting


## Usage with codeceptjs

Include it as helper in your codeceptjs project (see examples directory). Then run your tests
specifying the reporter host as environment variable, like so:

```
    cross-env TOKEN=12345 PROJECT=codeceptjs-demo DASHBOARD_HOST=localhost:8000 codeceptjs run
```