const { Queue } = require('bullmq');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const PHONE_NUMBER = process.argv[2] || '919999999999';

const queue = new Queue('whatsapp-notification-queue', {
    connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

async function run() {
    const jobData = {
        phoneNumber: PHONE_NUMBER,
        orderId: `TEST-ORD-${Date.now()}`,
        amountPaid: '₹499',
        paymentMode: 'UPI',
        transactionId: `TEST-TXN-${Date.now()}`,
        orderDate: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }),
    };

    console.log('Adding test job to whatsapp-notification-queue...');
    console.log('Redis:', `${REDIS_HOST}:${REDIS_PORT}`);
    console.log('Job data:', JSON.stringify(jobData, null, 2));

    const job = await queue.add('payment-confirmation', jobData);

    console.log(`Job added successfully! Job ID: ${job.id}`);
    console.log('Check the BullMQ dashboard at /admin/queues to see the job.');
    console.log('Check logs/whatsapp.log for processor output.');

    await queue.close();
    process.exit(0);
}

run().catch((err) => {
    console.error('Failed to add job:', err.message);
    process.exit(1);
});
