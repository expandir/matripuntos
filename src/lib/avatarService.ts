import { supabase } from './supabase';

const BUCKET = 'avatars';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const { data: existingFiles } = await supabase.storage.from(BUCKET).list(userId);
  if (existingFiles && existingFiles.length > 0) {
    const toDelete = existingFiles.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(toDelete);
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from('users')
    .update({ photo_url: publicUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return publicUrl;
}

export async function removeAvatar(userId: string): Promise<void> {
  const { data: files } = await supabase.storage.from(BUCKET).list(userId);
  if (files && files.length > 0) {
    const toDelete = files.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(toDelete);
  }

  const { error } = await supabase
    .from('users')
    .update({ photo_url: null })
    .eq('id', userId);

  if (error) throw error;
}
