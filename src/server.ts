import app from './app'
import dotenv from 'dotenv'
import initializeSocket from './socket';
import http  from 'http'
import { scheduleSubscriptionJobs } from './shared/utils/subscriptionScheduler';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


initializeSocket(server);
scheduleSubscriptionJobs()

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
