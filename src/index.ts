import app from './app';

const port = process.env.PORT || 8000;

app.listen(port, () => console.log('listening on port', port));

process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());
process.on('SIGABRT', () => process.exit());
