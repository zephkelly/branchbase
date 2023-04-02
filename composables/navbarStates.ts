export const toggleFeedMenu = () => useState<boolean>('feedToggle', () => false)
export const toggleFeedMenuString = () => useState<string>('feedToggleText', () => 'Home')