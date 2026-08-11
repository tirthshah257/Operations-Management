export function calculateSlaStatus(createdDate, slaHours) {
  if (!createdDate || !slaHours) {
    return {
      createdTime: new Date().toISOString(),
      slaDurationHours: Number(slaHours) || 4,
      dueTime: new Date().toISOString(),
      elapsedMinutes: 0,
      remainingMinutes: 0,
      progressPercent: 0,
      slaStatus: 'Within SLA'
    };
  }

  const createdTimeMs = new Date(createdDate).getTime();
  const slaDurationMs = Number(slaHours) * 3600 * 1000;
  const dueTimeMs = createdTimeMs + slaDurationMs;
  const nowMs = Date.now();

  const elapsedTimeMs = Math.max(0, nowMs - createdTimeMs);
  const remainingTimeMs = dueTimeMs - nowMs;
  const progressPercent = Math.min(100, Math.max(0, (elapsedTimeMs / slaDurationMs) * 100));

  let slaStatus = 'Within SLA';
  if (nowMs >= dueTimeMs) {
    slaStatus = 'Breached';
  } else if (progressPercent >= 50) {
    slaStatus = 'Approaching';
  }

  const elapsedMinutes = Math.floor(elapsedTimeMs / 60000);
  const remainingMinutes = Math.floor(Math.abs(remainingTimeMs) / 60000);

  const formatHoursMins = (totalMins) => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  return {
    createdTime: new Date(createdTimeMs).toISOString(),
    slaDurationHours: Number(slaHours),
    dueTime: new Date(dueTimeMs).toISOString(),
    elapsedMinutes,
    remainingMinutes,
    formattedElapsed: formatHoursMins(elapsedMinutes),
    formattedRemaining: formatHoursMins(remainingMinutes),
    progressPercent: Math.round(progressPercent),
    isOverdue: nowMs >= dueTimeMs,
    slaStatus
  };
}
