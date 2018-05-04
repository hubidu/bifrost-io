module.exports = ctx => {
    if (!process.env.OWNER_KEY) throw new Error('Please provide an owner key in process.env.OWNER_KEY')

    return {
        // TODO add runId
        ownerKey: process.env.OWNER_KEY,
        project: process.env.TEST_PROJECT || 'Unknown test project',
        runid: ctx.runId,
        type: 'test', // Dont remember what this is for
        result: ctx.result,
        reportFileName: ctx.reportFileName,
        reportDir: ctx.reportDir,
        startedAt: ctx.startedAt,
        duration: ctx.duration,
        prefix: ctx.prefix,
        title: ctx.title,
        fullTitle: ctx.fullTitle,

        // outline: ctx.outline // scenario outline

        screenshots: ctx.commands.map(cmd => {
            return Object.assign({}, cmd.screenshot, {
                page: cmd.pageInfo,
                codeStack: cmd.codeStack
            })
        }).filter(cmd => !!cmd.screenshot).reverse(),
        deviceSettings: ctx.deviceSettings, // TODO map this

        logs: [] // Browser logs
    }

}