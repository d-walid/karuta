import {useState, useEffect, useRef } from 'react'


// Counts down from duration seconds, calls `onExpire` when it reaches 0
export function useTimer(duration: number, onExpire: () => void, roundIndex: number = 0) {

    // Current time remaining in seconds
    const [timeLeft, setTimeLeft] = useState(duration)

    // useRef stores onExpire without triggering a re-render when it changes
    const onExpireRef = useRef(onExpire)
    onExpireRef.current = onExpire

    useEffect(() => {
        // Don't start the timer if duration is 0 (game not started yet)
        if (duration === 0) return

        // Reset the timer each time duration changes (= new round starts)
        setTimeLeft(duration)

        // setInterval calls the callback every 1000ms (1 second)
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time is up: stop the interval and notify the parent
                    clearInterval(interval)
                    onExpireRef.current()
                    return 0
                }
                // Decrement by 1 each tick
                return prev - 1
            })
        }, 1000)

        // Cleanup: clear the interval when the components unmount or duration changes
        return () => clearInterval(interval)
    }, [duration, roundIndex])

    return timeLeft
}