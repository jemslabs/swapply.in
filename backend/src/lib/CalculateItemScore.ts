export function calculateItemScore(item: {
  condition: string;
  hasBill: boolean;
  itemAge: number;
}) {
  const conditionMap: Record<string, number> = {
    NEW: 50,
    LIKE_NEW: 40,
    USED: 25,
    DAMAGED: 10,
  };

  const conditionScore = conditionMap[item.condition.toUpperCase()] || 0;
  const billScore = item.hasBill ? 20 : 0;
  const ageScore = Math.max(0, 30 - item.itemAge);

  return Math.min(100, conditionScore + billScore + ageScore);
}
