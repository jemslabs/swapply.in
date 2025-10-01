export const generateMeterScore = ({
  proposedThing,
  receivedThing,
  proposerType,
  receiverType,
}: {
  proposedThing: any;
  receivedThing: any;
  proposerType: "ITEM" | "SKILL";
  receiverType: "ITEM" | "SKILL";
}) => {
  let score = 0;

  // 1. Category Match (0-30)
  const categoryMatch =
    proposedThing.category && receivedThing.category
      ? proposedThing.category === receivedThing.category
        ? 30
        : 10
      : 0;
  score += categoryMatch;

  // 2. Value / Duration / Cross-Type Proximity (0-60)
  const valueScore = (() => {
    const itemValue = (item: any) => item.price ?? 1;
    const skillValue = (skill: any) => (skill.duration ?? 1) * 200; // 200 = INR/hour base rate

    let proposerValue =
      proposerType === "ITEM"
        ? itemValue(proposedThing)
        : skillValue(proposedThing);
    let receiverValue =
      receiverType === "ITEM"
        ? itemValue(receivedThing)
        : skillValue(receivedThing);

    const ratio =
      Math.min(proposerValue, receiverValue) /
      Math.max(proposerValue, receiverValue);
    const score = Math.floor(ratio * 60); // 0-60
    return score;
  })();
  score += valueScore;

  // 3. Trust Match (0-10)
  const badgeScore = (() => {
    let score = 0;

    if (
      proposedThing.user?.badges?.some((b: any) => b.type === "TOP_SWAPPER")
    ) {
      score += 5;
    }

    if (
      receivedThing.user?.badges?.some((b: any) => b.type === "TOP_SWAPPER")
    ) {
      score += 5;
    }

    return score;
  })();
  score += badgeScore;

  const finalScore = Math.min(100, Math.max(0, score));

  return {
    score: finalScore,
  };
};
