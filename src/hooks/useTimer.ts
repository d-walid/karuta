import {useState, useEffect, useRef } from 'react'


// Counts down from duration seconds, calls `onExpire` when it reaches 0
export function useTimer(duration: number, onExpire: () => void, roundIndex: number = 0) {

    // Current time remaining (0 to duration)
    const [timeLeft, setTimeLeft] = useState(duration)

    // useRef stores onExpire without triggering a re-render when it changes
    const onExpireRef = useRef(onExpire)
    onExpireRef.current = onExpire

    useEffect(() => {
        // Don't start the timer if duration is 0 (game not started yet)
        if (duration === 0) return

        // Reset the timer each time duration changes (= new round starts)
        setTimeLeft(duration)

        // setInterval calls the callback every 16ms (~60fps)
        const TICK = 16
        const decrement = duration * TICK / 30000
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= decrement) {
                    // Time is up: stop the interval and notify the parent
                    clearInterval(interval)
                    onExpireRef.current()
                    return 0
                }
                // Decrement proportionally each tick for smooth animation
                return prev - decrement
            })
        }, TICK)

        // Cleanup: clear the interval when the components unmount or duration changes
        return () => clearInterval(interval)
    }, [duration, roundIndex])

    return timeLeft
}