import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { NodeMailer } from "./NodeMailer";
import { MessageBody } from "../types";
require('dotenv').config()


async function initializeWorker() {
    try {
        // Initialize Redis connection
        const redisConnection = new Redis({
            host: 'localhost',
            port: 6379,
            db: 0,
            maxRetriesPerRequest: null
        });

        const NodeMailerObj = new NodeMailer();
        await NodeMailerObj.create_transport();

        // Create the worker
        const emailWorker = new Worker(
            'EMAIL_QUEUE',
            async (job: Job<MessageBody>) => {
                console.log('Processing job:', job.id, job.data);

                try {
                    // Send email using NodeMailer
                    const result = await NodeMailerObj.transporter.sendMail(job.data);
                    console.log('Email sent successfully:', result);
                    return result;
                } catch (error) {
                    console.error('Failed to process email job:', error);
                    throw error;
                }
            },
            {
                connection: redisConnection,
                concurrency: 5,
                limiter: {
                    max: 10,
                    duration: 1000
                }
            }
        );

        // Event handlers
        emailWorker.on('completed', (job: Job<MessageBody>) => {
            console.log(`Job ${job.id} completed successfully`);
        });

        emailWorker.on('failed', (job: Job<MessageBody> | undefined, error: Error) => {
            console.error(`Job ${job?.id} failed:`, error);
        });

        emailWorker.on('error', (error: Error) => {
            console.error('Worker error:', error);
        });

        emailWorker.on('ready', () => {
            console.log('Worker is ready to process jobs');
        });

        // Graceful shutdown handling
        process.on('SIGTERM', async () => {
            console.log('Shutting down worker...');
            await emailWorker.close();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log('Shutting down worker...');
            await emailWorker.close();
            process.exit(0);
        });

        return emailWorker;
    } catch (error) {
        console.error('Failed to initialize worker:', error);
        throw error;
    }
}

// Start the worker
initializeWorker()
    .then(() => {
        console.log('Worker started successfully');
    })
    .catch((error) => {
        console.error('Failed to start worker:', error);
        process.exit(1);
    });