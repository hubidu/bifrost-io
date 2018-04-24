module.exports = ctx => {
    return {
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
            return Object.assign(cmd.screenshot, {
                page: cmd.pageInfo,
                codeStack: cmd.codeStack
            })
        }),
        deviceSettings: ctx.deviceSettings, // TODO map this

        logs: [] // Browser logs
    }

}