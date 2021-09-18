const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, // subscribeTo (구독 대상)
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    } // subscribeFrom (구독을 누른 사람들)
}, { timestamps: true }) // timestamps -> 만든 date과 업데이트한 date이 표시가 됨

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }