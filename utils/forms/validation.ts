// Ensure that the query is not empty and is not longer than 255 characters
export function validateQuery(...params: (string | number)[]): boolean {
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