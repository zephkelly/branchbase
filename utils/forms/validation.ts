// Ensure that the query is not empty and is not longer than 255 characters
export function validateQueryLength(...params: (string | number)[]): boolean {
  const minLength = 1;
  const maxLength = 255;

  return params.every(param => {
    if (typeof param === 'string') {
      return param.trim().length >= minLength && param.trim().length <= maxLength;
    } else if (typeof param === 'number') {
      return param >= minLength && param <= maxLength;
    }
    return false;
  });
}

// Ensure that the query is not empty and is not longer than a custom amount characters
export function validateQueryCustom(param: (string | number), minLength: number = 1, maxLength: number = 255): boolean {
  if (typeof param === 'string') {
    return param.trim().length >= minLength && param.trim().length <= maxLength;
  } else if (typeof param === 'number') {
    return param >= minLength && param <= maxLength;
  }
  return false;
}

export function isInputAppropriate(result: any) {
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