import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get the user from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Log the content type for debugging
    console.log('Content-Type:', req.headers.get('content-type'));

    const formData = await req.formData()
    const file = formData.get('file')
    const folderId = formData.get('folderId')
    const tags = formData.get('tags')?.toString().split(',').filter(Boolean) || []

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Insert file metadata with user ID
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert({
        name: sanitizedFileName,
        storage_path: filePath,
        content_type: file.type,
        size: file.size,
        folder_id: folderId || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (fileError) {
      console.error('File metadata insert error:', fileError)
      return new Response(
        JSON.stringify({ error: 'Failed to save file metadata', details: fileError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Handle tags if provided
    if (tags.length > 0) {
      const { data: existingTags, error: tagsQueryError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags)

      if (tagsQueryError) {
        console.error('Tags query error:', tagsQueryError)
      }

      const existingTagNames = existingTags?.map(t => t.name) || []
      const newTags = tags.filter(t => !existingTagNames.includes(t))

      // Create new tags
      if (newTags.length > 0) {
        const { data: createdTags, error: createTagsError } = await supabase
          .from('tags')
          .insert(newTags.map(name => ({ 
            name,
            created_by: user.id
          })))
          .select()

        if (createTagsError) {
          console.error('Create tags error:', createTagsError)
        }

        existingTags?.push(...(createdTags || []))
      }

      // Associate tags with file
      if (existingTags) {
        const { error: fileTagsError } = await supabase
          .from('file_tags')
          .insert(existingTags.map(tag => ({
            file_id: fileData.id,
            tag_id: tag.id
          })))

        if (fileTagsError) {
          console.error('File tags association error:', fileTagsError)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully',
        file: fileData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})