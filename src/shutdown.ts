import { MongoClientObj } from "./routes";

async function gracefulShutdown() {
    try {
        if (MongoClientObj && typeof MongoClientObj.close_connection === 'function') {
            await MongoClientObj.close_connection();
            console.log("MongoDB connection closed.");
        }

    } catch (err) {
        console.error("Error during graceful shutdown:", err);
    }
    process.exit(0);
}

// Server Termination 
process.on('SIGINT', gracefulShutdown);    
process.on('SIGTERM', gracefulShutdown);   
process.on('SIGUSR2', gracefulShutdown);

process.on('uncaughtException', async (err) => {
    console.error("Uncaught Exception:", err);
    await MongoClientObj.close_connection();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await MongoClientObj.close_connection();
    process.exit(1);
});