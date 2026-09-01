const requiredCount = (value) => {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("bridge_completion_counts_invalid");
  }
  return value;
};

export const validateFullImportCompletion = (completion, perfumeProducts) => {
  if (!completion || typeof completion !== "object" || Array.isArray(completion)) {
    throw new Error("bridge_completion_counts_invalid");
  }
  const liveOffers = requiredCount(completion.liveOffers);
  const importedCount = requiredCount(completion.importedCount);
  if (perfumeProducts > 0 && (liveOffers === 0 || importedCount === 0)) {
    throw new Error("bridge_zero_publication_blocked");
  }
  return { liveOffers, importedCount };
};
