import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Howler } from 'howler';

import { fetchCards, fetchMusics } from '../data/api';
import type { Card, Music } from '../types';

import { useGameStore, shuffle } from "../stores/useGameStore";
import { useAudio } from "../hooks/useAudio";
import { useTimer } from "../hooks/useTimer";
import GameBoard from "../components/GameBoard";
import TimerBar from "../components/TimerBar";
import { Badge, Slider } from "@mantine/core";

import styles from './GamePage.module.css';


const ROUND_COUNT = 30

export default function GamePage() {
    const navigate = useNavigate()
    const [started, setStarted] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [allCards, setAllCards] = useState<Card[]>([])
    const [allMusics, setAllMusics] = useState<Music[]>([])
    const [loadError, setLoadError] = useState<string | null>(null)
    

    // Read state and actions from the Zustand store
    const {
        status, score, errors, cardStatuses, shuffledCards,
        currentRoundIndex, rounds, volume, 
        initGame, handleCardClick, handleExpire, setVolume, setLocked
    } = useGameStore()

    const { play, stop } = useAudio()
    const currentMusic = rounds[currentRoundIndex]?.music ?? null

    // Timer freeze during the music/round transition
    const timeLeft = useTimer(started && !isTransitioning ? 300 : 0, handleExpire, currentRoundIndex)

    // Load data from Supabase on mount
    useEffect(() => {
        Promise.all([fetchCards(), fetchMusics()])
            .then(([cards, musics]) => {
                setAllCards(cards)
                setAllMusics(musics)
            })
            .catch(err => setLoadError(err.message))
    }, []) 

    // Initialize a fresh game when the player clicks start
    const handleStart = () => {
        const selectedMusics = shuffle(allMusics).slice(0, ROUND_COUNT)
        const selectedWorkIds = new Set(selectedMusics.map(m => m.workId))
        const selectedCards = allCards.filter(c => selectedWorkIds.has(c.workId))
        initGame(selectedCards, selectedMusics, 'anime')
        setStarted(true)
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
            } else {
                stop()
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [currentMusic, started])

    // Apply the persisted volume on mount
    useEffect(() => { Howler.volume(volume) }, [])

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
                <button 
                    className={styles.button}  
                    onClick={handleStart}
                    disabled={allCards.length === 0}>
                    {allCards.length === 0 ? 'Loading...' : 'Start the game'}
                </button>

                <div className={styles.info}>
                    <span>Theme: Anime</span>
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
                        variant="outline"
                        color="var(--color-gold)"
                        size="xl"
                        classNames={{root: styles.badge}}>
                        Score: {score}
                    </Badge>

                    <Badge
                        variant="outline"
                        color="var(--color-gold)"
                        size="xl"
                        classNames={{root: styles.badge}}>
                        Errors: {errors}
                    </Badge>

                    <Badge
                        variant="outline"
                        color="var(--color-gold)"
                        size="xl"
                        classNames={{root: styles.badge}}>
                        Round: {isTransitioning ? currentRoundIndex : currentRoundIndex +1}/{rounds.length}
                    </Badge>                    
                </div>
                
                <div className={styles.hudRow}>
                <TimerBar timeLeft={timeLeft} duration={300} />
                </div>
            </div>
            <GameBoard
                cards={shuffledCards}
                cardStatuses={cardStatuses}
                onCardClick={handleCardClick}
            />
        </div>
    )
}