bifrost.io
====================

JS client library to send E2E reports to a [heimdall.io](https://github.com/hubidu/e2e-reporter-backend) dashboard service.
Supports the following JS UI test frameworks:

- [CodeceptJS](https://github.com/Codeception/CodeceptJS)

## See in action

### Going from a failing (red) to a green test

![Video](./doc/going-from-red-to-green-test.gif)

## Usage with [codeceptjs](./examples/codeceptjs)

Include it as helper in your codeceptjs project (see examples directory). Then run your tests
specifying
    
    - your heimdall.io key
    - your test project name
    - the heimdall.io host

```
    cross-env OWNER_KEY=12345 TEST_PROJECT=codeceptjs-demo DASHBOARD_HOST=localhost:8000 codeceptjs run
```