export const calculateTrend = (
  current: number,
  previous: number,
  label = "Compared to last month",
) => {
  if (previous === 0) {
    return {
      value: 0,
      direction: "neutral",
      label,
    };
  }

  const percentage = ((current - previous) / previous) * 100;

  return {
    value: Number(Math.abs(percentage).toFixed(1)),
    direction: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
    label,
  };
};