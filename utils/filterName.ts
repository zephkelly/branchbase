export function regexDisplayName(data: any) {
  return data.value?.user?.name.replace(/\*.*$/, '');
}

export function regexDisplayId(data: any) {
  return data.value?.user?.name.replace(/.*\*/, '');
}

export function regexDisplayIdRaw(data: string | undefined | null) {
  if (data == null || data == undefined) {
    return '';
  }

  return data.replace(/.*\*/, '');
}