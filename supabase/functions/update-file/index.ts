import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileId = formData.get('fileId') as string

    if (!file) {
      throw new Error('No file uploaded')
    }

    if (!fileId) {
      throw new Error('No file ID provided')
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the old file info to delete it later
    const { data: oldFile, error: fetchError } = await supabaseAdmin
      .from('files')
      .select('storage_path')
      .eq('id', fileId)
      .single()

    if (fetchError) throw fetchError

    // Upload new file
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const storagePath = `${timestamp}-${file.name}`

    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('files')
      .upload(storagePath, file)

    if (uploadError) throw uploadError

    // Update file record
    const { error: updateError } = await supabaseAdmin
      .from('files')
      .update({
        name: file.name,
        content_type: file.type,
        size: file.size,
        storage_path: storagePath,
      })
      .eq('id', fileId)

    if (updateError) throw updateError

    // Delete old file from storage
    if (oldFile?.storage_path) {
      await supabaseAdmin
        .storage
        .from('files')
        .remove([oldFile.storage_path])
    }

    return new Response(
      JSON.stringify({ message: 'File updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})