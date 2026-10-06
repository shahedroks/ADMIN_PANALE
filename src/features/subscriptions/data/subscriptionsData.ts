export const subscriptionGrowthSeries = {
  months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  premium: [1800, 2100, 2600, 3100, 3800, 4820],
  free: [9000, 9800, 10500, 11200, 12000, 13630],
  trials: [280, 310, 340, 360, 390, 412],
  labels: {
    May: "9.0k / 1.8k",
    Sep: "AI Launch",
    Oct: "13.6k / 4.8k",
  },
};

export const mrrVelocitySeries = {
  months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  values: [24.5, 26.8, 29.1, 31.4, 34.0, 38.4],
  basePortion: [18, 19.5, 21, 22.5, 24, 26.5],
};

export const subscriptionFooterMetrics = [
  { label: "Avg ARPU", value: "$7.97/mo", hint: "+4.1% MoM", hintTone: "positive" as const },
  { label: "Customer LTV", value: "$94.50", hint: "14.4 Mo Payback", hintTone: "neutral" as const },
  { label: "Net Churn", value: "-1.1%", hint: "Net Expansion", hintTone: "positive" as const },
];
