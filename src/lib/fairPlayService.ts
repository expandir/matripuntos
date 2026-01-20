import { supabase } from './supabase';

interface FairPlayCard {
  id: string;
  name: string;
  category: string;
  special: string | null;
  definition: string;
  conception: string;
  planning: string;
  execution: string;
  minimum_standard: string;
}

interface CardAssignment {
  id: string;
  couple_id: string;
  card_id: string;
  assigned_to: string;
  active: boolean;
}

export async function getAllCards(): Promise<FairPlayCard[]> {
  const { data, error } = await supabase
    .from('fair_play_cards')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getCardAssignments(coupleId: string): Promise<CardAssignment[]> {
  const { data, error } = await supabase
    .from('couple_card_assignments')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('active', true);

  if (error) throw error;
  return data || [];
}

export async function assignCard(coupleId: string, cardId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('couple_card_assignments')
    .insert({
      couple_id: coupleId,
      card_id: cardId,
      assigned_to: userId,
      active: true
    });

  if (error) throw error;
}

export async function unassignCard(assignmentId: string): Promise<void> {
  const { error } = await supabase
    .from('couple_card_assignments')
    .update({ active: false })
    .eq('id', assignmentId);

  if (error) throw error;
}
