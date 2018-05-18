bifrost.io
====================

JS client library to send E2E report data to a [heimdall.io](https://github.com/hubidu/e2e-reporter-backend) dashboard service for visualization.

Currently provides integrations for these UI testing frameworks:

- [CodeceptJS](https://github.com/Codeception/CodeceptJS)



## Use it in your codeceptjs project

### Install the bifrost-io client package

```bash
    npm i bifrost-io --save
```

### Add the .bifrost.js file to the root of your project and set ownerkey and dashboard host.

```js
    module.exports = {
        ownerkey: 'YOUR KEY HERE', 
        dashboardHost: 'YOUR DASHBOARD HOST NAME HERE'
    }
```

Alternatively you could provide key and host on a per run basis on the command line:

```bash
    cross-env OWNER_KEY=YOUR_KEY DASHBOARD_HOST=YOUR_HOST codeceptjs run
```

### Add the bifrost-io helper for codeceptjs to your codecept.json config file

NOTE that bifrost-io currently works ONLY with the WebDriverIO backend.

```json
  "helpers": {
    "WebDriverIO": {
      "url": "http://localhost",
      ...
    },
    "BifrostHelper": {
      "require": "bifrost-io/codeceptjs/dashboard_helper.js"
    },
    ...
  },
```

### Now just run your tests

```
    codeceptjs run
```

After the test run you should see this line in the output

```
Go here to see reports:
  http://heimdall.io:4000/tests?ownerkey=YOUR_KEY&project=YOUR_PROJECT&runid=H1RgPInCM
```

Just click on the link and view your reports

For a working codeceptjs example project please take a look at the [codeceptjs demo project](./examples/codeceptjs).


## See in action

### Going from a failing (red) to a green test

![Video](./doc/going-from-red-to-green-test.gif)

