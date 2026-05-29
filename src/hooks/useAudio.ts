import { useRef, useCallback } from 'react'
import { Howl } from 'howler'


// Controls audio playback for a single track at a time
export function useAudio() {
    // Howl | null means it can either be a Howl object or nothing (no track loaded yet)
    const howlRef = useRef<Howl | null>(null)

    // useCallback memorizes the function, it won't be recreated on every render
    const play = useCallback((audioFile: string) => {
        // If a track is already playing, stop it before starting a new one
        // The ?. (optional chaining) safely calls stop() only if howlRef.current is not null
        howlRef.current?.stop()
        howlRef.current?.unload()

        // Create a new Howl instance for the given audio file
        howlRef.current = new Howl({
            src: [audioFile],
            html5: true
        })

        howlRef.current.play()
    }, [])

    const stop = useCallback(() => {
        // Stop the current track and clear the ref
        howlRef.current?.stop()
        howlRef.current?.unload()
        howlRef.current = null
    }, [])

    return { play, stop }
}