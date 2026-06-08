import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, Music, CardStatus, GameState, Theme } from '../types'


// shuffles an array randomly (Fisher-Yates algorithm)
export function shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}


// Builds the initial cardStatuses: every card starts as 'idle'
function buildInitialStatuses(cards: Card[]): Record<string, CardStatus> {
    return Object.fromEntries(cards.map(card => [card.id, 'idle']))
}


// Builds the initial rounds list from the musics, shuffled
function buildRounds(musics: Music[]) {
    return shuffle(musics).map(music => ({
        music,
        foundCardIds: [],
        status: 'playing' as const,
    }))
}


// GameStore extends GameState with UI data (shuffledCards, volume)
// and actions (functions that mutate the state)
type GameStore = GameState & {
    shuffledCards: Card[]
    volume: number
    isLocked: boolean
    nickname: string
    startedAt: number | null
    scoreSubmitted: boolean
    initGame: (cards: Card[], musics: Music[], theme: Theme) => void
    handleCardClick: (cardId: string) => void
    handleExpire: () => void
    setVolume: (value: number) => void
    setLocked: (value: boolean) => void
    setNickname: (value: string) => void
    setScoreSubmitted: () => void
    resetGame: () => void
}


// create<GameStore>() creates the Zustand score
// persist() is a middleware: it saves selected values to localStorage
// the double ()() is required syntax when wrapping with a middleware
// set() updates the state (like React's setState)
// get() reads the current state from inside an action without triggering re-render
export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            // Initial state
            status: 'idle',
            theme: 'anime',
            rounds: [],
            currentRoundIndex: 0,
            score: 0,
            errors: 0,
            cardStatuses: {},
            shuffledCards: [],
            volume: 0.10,
            isLocked: false,
            nickname: '',
            startedAt: null,
            scoreSubmitted: false,

            // Resets and initializes a new game
            initGame: (cards, musics, theme) => {
                set({
                    status: 'playing',
                    theme,
                    rounds: buildRounds(musics),
                    currentRoundIndex: 0,
                    score: 0,
                    errors: 0,
                    cardStatuses: buildInitialStatuses(cards),
                    shuffledCards: shuffle(cards),
                    isLocked: false,
                    startedAt: Date.now(),
                    scoreSubmitted: false,
                })
            },

            // Handles a card click: checks correctness, updates score and statuses
            handleCardClick: (cardId) => {
                const prev = get()
                const status = prev.cardStatuses[cardId]

                // Ignore clicks on cards that are not idle
                if (status !== 'idle') return
                if (prev.isLocked) return 

                const currentRound = prev.rounds[prev.currentRoundIndex]
                const currentMusic = currentRound.music
                const isCorrect = currentMusic.cardIds.includes(cardId)

                if (!isCorrect) {
                    // Wrong card: flash as "wrong" then reset to "idle" after ms defined
                    setTimeout(() => {
                        set(current => ({
                            cardStatuses: {...current.cardStatuses, [cardId]: 'idle'}
                        }))
                    }, 600)
                    set({
                        score: Math.max(0, prev.score - 1),
                        errors: prev.errors + 1,
                        cardStatuses: {...prev.cardStatuses, [cardId]: 'wrong'}
                    })
                    return
                }

                const newFoundCardsIds = [...currentRound.foundCardIds, cardId]

                // Both cards of the pair found: remove them and advance to next round
                if (newFoundCardsIds.length === 2) {
                    const updatedStatuses = {...prev.cardStatuses}
                    currentMusic.cardIds.forEach(id => {updatedStatuses[id] = 'selected'})

                    setTimeout(() => {
                        set(current => {
                            const afterRemove = {...current.cardStatuses}
                            currentMusic.cardIds.forEach(id => { afterRemove[id] = 'removed'})
                            return { cardStatuses: afterRemove }
                        })
                    }, 400)

                    const updatedRounds = [...prev.rounds]
                    updatedRounds[prev.currentRoundIndex] = {
                        ...currentRound,
                        foundCardIds: newFoundCardsIds,
                        status: 'success'
                    }

                    const isLastRound = prev.currentRoundIndex >= prev.rounds.length - 1
                    set({
                        score: prev.score + 1,
                        status: isLastRound ? 'finished' : 'playing',
                        currentRoundIndex: isLastRound ? prev.currentRoundIndex : prev.currentRoundIndex + 1,
                        cardStatuses: updatedStatuses,
                        rounds: updatedRounds,
                        isLocked: true
                    })
                    return
                }

                // First card of the pair: mark as 'selected' and award +1
                const updatedRounds = [...prev.rounds]
                updatedRounds[prev.currentRoundIndex] = {
                    ...currentRound,
                    foundCardIds: newFoundCardsIds
                }

                set({
                    score: prev.score + 1,
                    cardStatuses: {...prev.cardStatuses, [cardId]: 'selected'},
                    rounds: updatedRounds
                })
            },

            // Handles timer expiration: removes cards and penalizes if none were found
            handleExpire: () => {
                const prev = get()
                const currentRound = prev.rounds[prev.currentRoundIndex]
                const foundCount = currentRound.foundCardIds.length

                // If the user gets only one good card, the other is selected as revealed (gold)
                const updatedStatuses = {...prev.cardStatuses}
                currentRound.music.cardIds.forEach(id => {
                    if (updatedStatuses[id] !== 'selected') {
                        updatedStatuses[id] = 'revealed'
                    }
                })

                // Letting the user see the missing card(s) before it disappears
                setTimeout(() => {
                    set(current => {
                        const afterRemove = {...current.cardStatuses}
                        currentRound.music.cardIds.forEach(id => { afterRemove[id] = 'removed'})
                        return { cardStatuses: afterRemove }
                    })
                }, 1500)

                const updatedRounds = [...prev.rounds]
                updatedRounds[prev.currentRoundIndex] = {...currentRound, status: 'timeout'}
                const isLastRound = prev.currentRoundIndex >= prev.rounds.length - 1

                set({
                    // -2 only if no card was found this round
                    score: foundCount === 0 ? Math.max(0, prev.score - 2) : prev.score,
                    status: isLastRound ? 'finished' : 'playing',
                    currentRoundIndex: isLastRound ? prev.currentRoundIndex : prev.currentRoundIndex + 1,
                    cardStatuses: updatedStatuses,
                    rounds: updatedRounds
                })
            },

            // Updates the global audio volume of the music
            setVolume: (value) => set({ volume: value }),
            setLocked: (value) => set({ isLocked: value }),
            setNickname: (value) => set({ nickname: value }),
            setScoreSubmitted: () => set({ scoreSubmitted: true }),

            resetGame: () => set({
                status: 'idle',
                rounds: [],
                currentRoundIndex: 0,
                score: 0,
                errors: 0,
                cardStatuses: {},
                shuffledCards: [],
                isLocked: false,
            })
        }),
        {
            // Key used in localStorage
            name: 'karuta-game',
            // Only persist the volume - not the game state
            partialize: (state) => ({ volume: state.volume, nickname: state.nickname }),
        }
    )
)