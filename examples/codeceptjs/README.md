# codeceptjs and bifrost demo project

## Install

### Install and run selenium-standalone

```
    npm -g install selenium-standalone
    selenium-standalone install
    selenium-standalone start
```

### Install and run the tests

```
    npm install
    ./node_modules/.bin/codeceptjs run
```

## Run with firefox

```
    cross-env TEST_BROWSER=firefox ./node_modules/.bin/codeceptjs run
```

NOTE that:
  - Firefox driver does not support selecting elements by id. Therefore css id selectors must be prefixed with another selector (e. g. 'body #some-id-selector')
  - Firefox does not support the browser log command