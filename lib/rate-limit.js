import connectDB from "./db-connect";

export function rateLimit(options) {
    const { interval = 60000 } = options || {};

    return {
        check: async (limit, token) => {
            const mongoose = await connectDB();
            const db = mongoose.connection.db;
            const collection = db.collection("rate_limits");

            const count = await collection.countDocuments({ token });

            if (count >= limit) {
                return {
                    isRateLimited: true,
                    currentUsage: count,
                    limit,
                };
            }

            await collection.insertOne({
                token,
                createdAt: new Date(),
            });

            return {
                isRateLimited: false,
                currentUsage: count + 1,
                limit,
            };
        },
    };
}