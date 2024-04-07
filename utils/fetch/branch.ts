// Does branch exist?
export async function branchExists(name: string): Promise<boolean> {
  const doesBranchExist = await useFetch(`/api/branches/exists?branchName=${name}`);

  //@ts-expect-error
  if (doesBranchExist.data.value?.exists == "true") {
    return true;
  } else {
    return false;
  }
}