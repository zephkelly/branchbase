export function validateBranchName(value: string, returnBool: boolean = false) {
  let passedValiation = true;
  
  if (value.length > 21) {
    value = value.slice(0, 21);
    passedValiation = false;
  }

  //if the name contains spaces remove them
  if (value.includes(' ')) {
    value = value.replace(/\s/g, '');
    passedValiation = false;
  }

  // Remove all specail characters except dashes
  if (value.match(/[^a-zA-Z0-9-]/g)) {
    value = value.replace(/[^a-zA-Z0-9-]/g, '');
    passedValiation = false;
  }

  //Remove double dashes
  if (value.match(/--/g)) {
    value = value.replace(/--/g, '-');
    passedValiation = false;
  }

  if (returnBool) {
    return passedValiation
  } else {
    return value;
  }
}