import { format } from 'date-fns';

export const formatDate = (date) => format(date, 'dd MMM yyyy');
export const formatTime = (date) => format(date, 'hh:mm a');
