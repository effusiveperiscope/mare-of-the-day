export function writeOutDate(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);

  return `${month} ${day}${suffix}, ${year}`;
}

function getDaySuffix(day: number) {
  if (day === 1 || day === 21 || day === 31) {
    return 'st';
  } else if (day === 2 || day === 22) {
    return 'nd';
  } else if (day === 3 || day === 23) {
    return 'rd';
  } else {
    return 'th';
  }
}
