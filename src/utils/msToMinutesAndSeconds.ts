function msToMinutesAndSeconds(ms: number | undefined) {
  if (!ms) return "";
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return seconds === 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
export default msToMinutesAndSeconds;
