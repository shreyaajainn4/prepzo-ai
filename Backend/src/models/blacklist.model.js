const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ],
        index: true  // Index for O(1) lookups instead of full collection scan
    }
}, {
    timestamps: true
})

// Auto-delete blacklisted tokens after 7 days (matches JWT expiry)
// Prevents the collection from growing indefinitely and slowing down queries
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 })

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel