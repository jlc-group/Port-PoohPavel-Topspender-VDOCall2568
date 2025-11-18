import { useState, useEffect } from 'react';
import { COUNTDOWN_TARGET } from '@utils/constants';

export const useCountdown = (targetDate = COUNTDOWN_TARGET) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
      setIsExpired(false);
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Format countdown values
  const formattedCountdown = {
    days: countdown.days.toString(),
    hours: countdown.hours.toString().padStart(2, '0'),
    minutes: countdown.minutes.toString().padStart(2, '0'),
    seconds: countdown.seconds.toString().padStart(2, '0'),
  };

  // Get human readable time remaining
  const getTimeRemaining = () => {
    if (isExpired) return 'หมดเวลาแล้ว';

    const parts = [];
    if (countdown.days > 0) parts.push(`${countdown.days} วัน`);
    if (countdown.hours > 0) parts.push(`${countdown.hours} ชั่วโมง`);
    if (countdown.minutes > 0) parts.push(`${countdown.minutes} นาที`);
    if (countdown.seconds > 0) parts.push(`${countdown.seconds} วินาที`);

    return parts.length > 0 ? parts.join(' ') : 'หมดเวลาแล้ว';
  };

  return {
    // Raw values
    ...countdown,

    // Formatted values
    ...formattedCountdown,

    // Computed
    isExpired,
    timeRemaining: getTimeRemaining(),

    // Booleans
    hasDays: countdown.days > 0,
    hasHours: countdown.hours > 0 || countdown.days > 0,
    hasMinutes: countdown.minutes > 0 || countdown.hours > 0 || countdown.days > 0,

    // Progress (0-100)
    progress: Math.max(0, Math.min(100, ((COUNTDOWN_TARGET.getTime() - new Date().getTime()) / (COUNTDOWN_TARGET.getTime() - new Date(COUNTDOWN_TARGET.getTime() - (30 * 24 * 60 * 60 * 1000)).getTime())) * 100)),
  };
};