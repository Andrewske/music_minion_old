const convertDuration = (duration) => {
  let seconds = duration / 1000;
  const hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = parseInt(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return hours > 1 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

export default convertDuration;
