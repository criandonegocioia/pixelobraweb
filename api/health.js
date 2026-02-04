export default function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env_check: process.env.EMAIL_USER ? 'Set' : 'Missing',
        runtime: 'vercel-serverless-js'
    });
}
