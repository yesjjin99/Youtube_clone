if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); // 개발환경이 production 모드일 때 -> prod.js 로
} else {
    module.exports = require('./dev'); // 개발환경이 local 일 때 -> dev.js 로
}