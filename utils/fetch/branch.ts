// Does branch exist?
export async function branchExists(name: string): Promise<boolean> {
  const doesBranchExist = await useFetch(`/api/branches/exists?branchName=${name}`);

  if (doesBranchExist.data.value?.exists) {
    return true;
  } else {
    return false;
  }
}