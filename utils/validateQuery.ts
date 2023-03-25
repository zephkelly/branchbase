export function validateQuery(...params: (string | number)[]) {
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