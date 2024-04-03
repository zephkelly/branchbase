function validateQueryLength(...params) {
  const minLength = 1;
  const maxLength = 255;
  return params.every((param) => {
    if (typeof param === "string") {
      return param.trim().length >= minLength && param.trim().length <= maxLength;
    } else if (typeof param === "number") {
      return param >= minLength && param <= maxLength;
    }
    return false;
  });
}
function validateQueryCustom(param, minLength = 1, maxLength = 255) {
  if (typeof param === "string") {
    return param.trim().length >= minLength && param.trim().length <= maxLength;
  } else if (typeof param === "number") {
    return param >= minLength && param <= maxLength;
  }
  return false;
}
function isInputAppropriate(result) {
  if (result.attributeScores.TOXICITY.summaryScore.value > 0.75) {
    return false;
  }
  if (result.attributeScores.PROFANITY.summaryScore.value > 0.5) {
    return false;
  }
  if (result.attributeScores.IDENTITY_ATTACK.summaryScore.value > 0.5) {
    return false;
  }
  if (result.attributeScores.IDENTITY_ATTACK.summaryScore.value > 0.35 && result.attributeScores.TOXICITY.summaryScore.value > 0.45) {
    return false;
  }
  const totalScore = result.attributeScores.TOXICITY.summaryScore.value + result.attributeScores.PROFANITY.summaryScore.value + result.attributeScores.IDENTITY_ATTACK.summaryScore.value;
  if (totalScore > 0.92) {
    return false;
  }
  return true;
}

export { validateQueryCustom as a, isInputAppropriate as i, validateQueryLength as v };
//# sourceMappingURL=validation.mjs.map
