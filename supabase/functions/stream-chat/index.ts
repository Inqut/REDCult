import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const LLAMA_API_URL = Deno.env.get('LLAMA_API_URL') || 'https://llama8b.gaia.domains/v1'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] || ''
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { cultId, agentId, message } = await req.json()

    // Verify access and get agent config
    const [{ data: cultRole }, { data: agent }] = await Promise.all([
      supabase
        .from('cult_roles')
        .select('role')
        .eq('cult_id', cultId)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('cult_agents')
        .select('*')
        .eq('id', agentId)
        .eq('cult_id', cultId)
        .single(),
    ])

    if (!cultRole || !agent) {
      throw new Error('Access denied')
    }

    // Set up SSE
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Start Llama API request
    fetch(`${LLAMA_API_URL}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: agent.model,
        prompt: formatPrompt(agent.config, message),
        max_tokens: 500,
        temperature: 0.7,
        stop: ['User:', 'Response:', 'System:'],
        stream: true,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('API request failed')
      
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6))
              const token = sanitizeResponse(data.choices[0].text)
              await writer.write(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
            }
          }
        }
      } finally {
        reader.releaseLock()
        await writer.close()
      }
    }).catch(async (error) => {
      console.error('Stream error:', error)
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
      await writer.close()
    })

    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

function formatPrompt(config: any, message: string): string {
  return [
    `You are ${config.name}, an AI agent with the following characteristics:`,
    ...config.bio,
    '\nKnowledge:',
    ...config.knowledge,
    '\nStyle:',
    ...config.style.chat,
    `\nUser: ${message}`,
    '\nResponse:',
  ].join('\n')
}

function sanitizeResponse(text: string): string {
  return text
    .replace(/^(System:|Assistant:|AI:|Response:)/gi, '')
    .trim()
}