const DashboardTestContext = require('./dashboard-test-context')

class DashboardClient {
    constructor() {
        this.screenshots = []
    }

    createTestContext(suiteTitle, testTitle) {
        const ctx = new DashboardTestContext(suiteTitle, testTitle)
        return ctx
    }

    destroyTestContext() {
    }

}

module.exports = DashboardClient