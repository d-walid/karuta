import { supabase } from "../lib/supabase";
import type { Work, Card, Music, Theme } from '../types';


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