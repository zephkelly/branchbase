export const isCreatingIndex = () => useState<boolean>('isCreatingIndex', () => false);
export const isCreatingBranch = () => useState<boolean>('isCreatingBranch', () => false);

export const isDraggingControlBarIndex = () => useState<boolean>('isDraggingControlBarIndex', () => false);
export const isDraggingControlBarBranch = () => useState<boolean>('isDraggingControlBarBranch', () => false);

export const controlBarPostitionIndex = () => useState<string>('controlBarPostitionIndex', () => 'middle');