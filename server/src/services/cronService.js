import cron from 'node-cron';

export const scheduleCleanup = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running nightly cleanup job for Student Toolkit backend.');
    // Future: remove stale local data, archive logs, sync schedule summaries.
  });
};
