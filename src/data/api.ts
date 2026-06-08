import { supabase } from "../lib/supabase";
import type { Work, Card, Music, Theme } from '../types';



export type ScorePayload = {
    nickname: string
    score: number
    errors: number
    duration_ms: number
    theme: string
}


export type LeaderboardEntry = {
    id: string
    nickname: string
    score: number
    errors: number
    duration_ms: number
    theme: string
    played_at: string
}


export async function fetchWorks(): Promise<Work[]> {
    const { data, error } = await supabase.from('works').select('*');

    if (error) throw new Error(`fetchWorks: ${error.message}`);
    
    return data.map(row => ({
        id: row.id as string,
        title: row.title as string,
        theme: row.theme as Theme,
    }));
}


export async function fetchCards(): Promise<Card[]> {
    const { data, error } = await supabase.from('cards').select('*');

    if (error) throw new Error(`fetchCards: ${error.message}`);

    return data.map(row => ({
        id: row.id as string,
        workId: row.work_id as string,
        imageFile: row.image_file as string,
        label: row.label as string,
    }));
}


export async function fetchMusics(): Promise<Music[]> {
    const { data, error } = await supabase.from('musics').select('*');

    if (error) throw new Error(`fetchMusics: ${error.message}`);

    return data.map(row => ({
        id: row.id as string,
        workId: row.work_id as string,
        title: row.title as string,
        audioFile: row.audio_file as string,
        cardIds: row.card_ids as [string, string]
    }));
}


export async function submitScore(payload: ScorePayload): Promise<void> {
    const { error } = await supabase.from('scores').insert(payload)
    if (error) throw new Error(error.message)
}


export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .order('duration_ms', { ascending: true})
        .limit(10)

    if (error) throw new Error(error.message)
    return data as LeaderboardEntry[]
}