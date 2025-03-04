'use client';

import { useEffect } from 'react';
import { clearTasksStorage } from '@/lib/tasks';
import { clearNotificationsStorage } from '@/lib/notifications';
import { clearEventsStorage } from '@/lib/events';

export function ClearStorage() {
  useEffect(() => {
    clearTasksStorage();
    clearNotificationsStorage();
    clearEventsStorage();
  }, []);
  
  return null;
} 