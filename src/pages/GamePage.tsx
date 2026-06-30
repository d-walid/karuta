import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Howler } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchCards, fetchMusics } from '../data/api';
import { formatTimeLive } from "../utils/formatTime";
import type { Card, Music, Theme } from '../types';
import { 
    useGameStore, shuffle, 
    COMBO_THRESHOLD, SPEED_BONUS_THRESHOLD_SECONDS, SPEED_BONUS, 
    SCORE_NORMAL, SCORE_COMBO, SCORE_WRONG} from "../stores/useGameStore";
import { useAudio } from "../hooks/useAudio";
import { useTimer } from "../hooks/useTimer";
import GameBoard from "../components/GameBoard";
import TimerBar from "../components/TimerBar";

import { Badge, Slider } from "@mantine/core";
import styles from './GamePage.module.css';


const ROUND_COUNT = 30

export default function GamePage() {
    const navigate = useNavigate()
    const { theme } = useParams<{ theme: Theme}>()
    const [started, setStarted] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [allCards, setAllCards] = useState<Card[]>([])
    const [allMusics, setAllMusics] = useState<Music[]>([])
    const [loadError, setLoadError] = useState<string | null>(null)
    const [elapsedMs, setElapsedMs] = useState(0)
    const [cardPoints, setCardPoints] = useState<Record<string, number | null>>({})
    

    // Read state and actions from the Zustand store
    const {
        status, score, errors, cardStatuses, shuffledCards,
        currentRoundIndex, rounds, volume, nickname, startedAt, comboCount,
        initGame, handleCardClick, handleExpire, setVolume, 
        setLocked, setNickname, setRoundStartedAt
    } = useGameStore()

    const { play, stop } = useAudio()
    const currentMusic = rounds[currentRoundIndex]?.music ?? null

    // Timer freeze during the music/round transition
    const timeLeft = useTimer(started && !isTransitioning ? 30000 : 0, handleExpire, currentRoundIndex)

    // Load data from Supabase on mount
    useEffect(() => {
        if (!theme) return
        Promise.all([fetchCards(theme), fetchMusics(theme)])
            .then(([cards, musics]) => {
                setAllCards(cards)
                setAllMusics(musics)
            })
            .catch(err => setLoadError(err.message))
    }, [theme]) 

    // Initialize a fresh game when the player clicks start
    const handleStart = () => {
        if (!theme) return
        const selectedMusics = shuffle(allMusics).slice(0, ROUND_COUNT)
        const selectedWorkIds = new Set(selectedMusics.map(m => m.workId))
        const selectedCards = allCards.filter(c => selectedWorkIds.has(c.workId))
        initGame(selectedCards, selectedMusics, theme)
        setStarted(true)
    }

    // Display points as a popup on the card when the user click it
    const showPoints = (cardId: string, pts: number) => {
        setCardPoints(prev => ({ ...prev, [cardId]: pts }))
        setTimeout(() => {
            setCardPoints(prev => ({ ...prev, [cardId]: null}))
        }, 900)
    }

    const handleCardClickWithPoints = (cardId: string) => {
        const state = useGameStore.getState()
        if (state.isLocked) return
        if (state.cardStatuses[cardId] !== 'idle') return 
        
        const currentRound = state.rounds[state.currentRoundIndex]
        const isCorrect = currentRound?.music.cardIds.includes(cardId)

        if (!isCorrect) {
            showPoints(cardId, SCORE_WRONG)
        } else {
            const newFoundCount = currentRound.foundCardIds.length + 1
            if (newFoundCount === 1) {
                const elapsedSeconds = state.roundStartedAt
                    ? (Date.now() - state.roundStartedAt) / 1000
                    : Infinity
                const speedBonus = elapsedSeconds <= SPEED_BONUS_THRESHOLD_SECONDS ? SPEED_BONUS : 0
                showPoints(cardId, SCORE_NORMAL + speedBonus)
            } else {
                const inCombo = (state.comboCount + 1) >= COMBO_THRESHOLD
                const elapsedSeconds = state.roundStartedAt
                    ? (Date.now() - state.roundStartedAt) / 1000
                    : Infinity
                const speedBonus = elapsedSeconds <= SPEED_BONUS_THRESHOLD_SECONDS ? SPEED_BONUS : 0
                const pts = (inCombo ? SCORE_COMBO : SCORE_NORMAL) + speedBonus
                showPoints(cardId, pts)
            }
        }
        handleCardClick(cardId)

    }

    // Play music when started or when currentMusic changes
    useEffect(() => {
        if (!started) return

        // Freeze the timer during the pause
        setIsTransitioning(true)
        stop()

        // Small pause between rounds before playing the next music
        const timeout = setTimeout(() => {
            setIsTransitioning(false)
            setLocked(false)
            if (currentMusic) {
                play(currentMusic.audioFile)
                setRoundStartedAt(Date.now())
            } else {
                stop()
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [currentMusic, started])

    // Apply the persisted volume on mount
    useEffect(() => { Howler.volume(volume) }, [])

    // Realtime timer for the user once the game is launched
    useEffect(() => {
        if (!started || !startedAt) return
        const interval = setInterval(() => {
            setElapsedMs(Date.now() - startedAt)
        }, 10)
        return () => clearInterval(interval)
    }, [started, startedAt])

    // Navigate to results when the game is finished
    useEffect(() => { if (status === 'finished') navigate('/results')}, [status])

    // Stop audio on unmount
    useEffect(() => { return () => { stop() }}, [])

    if (loadError) {
        return <div className={styles.lobby}>Loading error: {loadError}</div>
    }

    if (!started) {
        return (
            <div className={styles.lobby}>
                <input
                    className={styles.nicknameInput}
                    type="text"
                    placeholder="Your nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                />

                <button 
                    className={styles.button}  
                    onClick={handleStart}
                    disabled={allCards.length === 0 || nickname.trim() === ''}>
                    {allCards.length === 0 ? 'Loading...' : 'Start the game'}
                </button>

                <div className={styles.info}>
                    <span>Theme: {theme}</span>
                    <span>{ROUND_COUNT} musics - {ROUND_COUNT * 2} cards</span>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.volumeControl}>
                <span>🔊</span>
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(value) => { setVolume(value); Howler.volume(value) }}
                    aria-label="Volume"
                    label={null}
                    classNames={{ root: styles.slider }}
                />
            </div>
            
            <div className={styles.hud}>
                <div className={styles.hudRow}>
                    <Badge
                        variant="filled"
                        size="xl"
                        classNames={{root: `${styles.badge} ${styles.badgeScore}`}}>
                        🎯 Score: {score}
                    </Badge>

                    <Badge
                        variant="filled"
                        size="xl"
                        classNames={{root: `${styles.badge} ${styles.badgeErrors}`}}>
                        ❌ Errors: {errors}
                    </Badge>

                    <Badge
                        variant="filled"
                        size="xl"
                        classNames={{root: `${styles.badge} ${styles.badgeRound}`}}>
                        🎵 Round: {isTransitioning ? currentRoundIndex : currentRoundIndex +1}/{rounds.length}
                    </Badge>
                    
                    <Badge
                        variant="filled"
                        size="xl"
                        classNames={{root: `${styles.badge} ${styles.badgeTime}`}}>
                        ⏱️ Time: {formatTimeLive(elapsedMs)}
                    </Badge>

                    <AnimatePresence>
                        {comboCount >= COMBO_THRESHOLD && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: [1, 1.03, 1],
                                }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    scale: { duration: 0.6, repeat: Infinity, ease: 'easeInOut'},
                                    opacity: { duration: 0.3 }
                                }}
                            >
                                <Badge
                                    variant="filled"
                                    color="var(--color-red)"
                                    size="lg"
                                    classNames={{root: styles.badge}}>
                                    🔥Combo x{comboCount}
                                </Badge>
                            </motion.div>
                        )}   
                    </AnimatePresence>
                </div>
                
                <div className={styles.hudRow}>
                <TimerBar timeLeft={timeLeft} duration={30000} />
                </div>
            </div>
            <GameBoard
                cards={shuffledCards}
                cardStatuses={cardStatuses}
                cardPoints={cardPoints}
                onCardClick={handleCardClickWithPoints}
            />
        </div>
    )
}