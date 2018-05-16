const assert = require('assert')

const toString = v => {
    if (typeof v === 'object') return JSON.stringify(v)
    return v.toString()
}
  

module.exports = (ctx) => {
    assert(ctx, 'Please provide a text context')

    return {
        ownerKey: ctx.OWNER_KEY,
        project: ctx.TEST_PROJECT || 'Unknown test project',
        runid: ctx.runid,
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
                cmd: {
                    name: cmd.name,
                    args: cmd.args.map(toString)
                },
                page: cmd.pageInfo,
                codeStack: cmd.codeStack.reverse() // code snippet of command is first
            })
        }).filter(cmd => !!cmd.screenshot).reverse(),
        deviceSettings: ctx.deviceSettings, // TODO map this

        logs: [] // Browser logs
    }

}