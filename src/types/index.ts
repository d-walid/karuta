// Available themes
export type Theme = 'anime'


// A Work
export type Work = {
    id: string
    title: string
    theme: Theme
}


// A Card (image displayed on screen)
export type Card = {
    id: string
    workId: string
    imageFile: string
    label: string
}


// A music
export type Music = {
    id: string
    workId: string
    title: string
    audioFile: string
    cardIds: [string, string]
}


// State of a card during the game
export type CardStatus = 'idle' | 'selected' | 'matched' | 'removed' | 'wrong'


// A round
export type Round = {
    music: Music
    foundCardIds: string[]
    status: 'playing' | 'success' | 'timeout'
}


// Global state of the game
export type GameState = {
    status: 'idle' | 'playing' | 'finished'
    theme: Theme
    rounds: Round[]
    currentRoundIndex: number
    score: number
    errors: number
    cardStatuses: Record<string, CardStatus>
}


