const avatars: string[] = [
    '/static/avatars/avatar_1.png',
    '/static/avatars/avatar_2.png',
    '/static/avatars/avatar_3.png',
]

export function getRandomAvatar(): string {
    const randomNum = Math.floor(Math.random() * avatars.length - 1) + 1
    return avatars[randomNum]
}