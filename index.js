const assert = require('assert')
const shortid = require('shortid');

const DashboardTestContext = require('./dashboard-test-context')
const { getDashboardUrl } = require('./dashboard-api')

class DashboardClient {
    constructor() {
        this.OWNER_KEY = process.env.OWNER_KEY
        assert(this.OWNER_KEY, 'Expected an access OWNER_KEY for the dashboard service (process.env.OWNER_KEY)')
        this.TEST_PROJECT = process.env.TEST_PROJECT
        assert(this.TEST_PROJECT, 'Expected a project name/identifier for this e2e project (process.env.TEST_PROJECT)')

        this.runid = shortid.generate()
        this.ctx = undefined
    }

    createTestContext(suiteTitle, testTitle) {
        const ctx = new DashboardTestContext(this.runid, suiteTitle, testTitle)
        this.ctx =  ctx
        return ctx
    }

    async getDashboardUrl() {
        const dashboardResult = await getDashboardUrl(this.OWNER_KEY, this.TEST_PROJECT, this.runid)
        if (!dashboardResult) return

        const { Url } = dashboardResult
        return Url
    }
}

module.exports = DashboardClient