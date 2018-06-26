const test = require('ava')
const extractTags = require('./extract-tags')

test('@foo @bar Some description', t => {
    const {tags, str} = extractTags('@foo @bar Some description')
    t.is(2, tags.length)
    t.deepEqual(tags, ['@foo', '@bar'])
    t.is(str, 'Some description')
});

test('@foo @bar Some description', t => {
    const {tags, str} = extractTags('@foo Some @bar description')
    t.is(2, tags.length)
    t.is(str, 'Some  description')
});

test('@foo @bar Some description', t => {
    const {tags, str} = extractTags('@foo Some description @bar @baz')
    t.is(3, tags.length)
    t.is(str, 'Some description')
});
