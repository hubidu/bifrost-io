exports.config = {
    "output": "./__out",
    "helpers": {   
      "WebDriverIO": {
        "url": "http://localhost",
        "browser": "chrome",
        "restart": true,
        "keepBrowserState": false,
        "keepCookies": false,
        "smartWait": 2000,
        "waitForTimeout": 10000,
        "desiredCapabilities": {
          "goog:chromeOptions": {
            "args": [ "--disable-gpu", "--window-size=1200,1200" ],
            "mobileEmulation": process.env.TEST_DEVICE ? ({
              "deviceName": "iPhone 6 Plus"
            }) : undefined
          }
        },
        "chrome": {
          "headless": false
        }
      },
      "BifrostHelper": {
        "require": "bifrost-io/codeceptjs/dashboard_helper.js"
      },
      "CustomCommandsHelper": {
        "require": "./custom-commands.js"
      }
    },
    "multiple": {
      "parallel": {
        "chunks": 2,
        "browsers": ["chrome"]
      }
    },  
    "include": {
      "I": "./custom-steps.js",
      "loginPage": "./pages/login.page.js",
      "onHandyTariffsPage": "./pages/handy-tariffs.page.js",
    },
    "mocha": {},
    "bootstrap": false,
    "teardown": null,
    "hooks": [],
    "tests": "./features/*_test.js",
    "timeout": 10000,
    "name": "codeceptjs"
}