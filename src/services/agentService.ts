import { supabase } from '../lib/supabase';

interface CreateAgentParams {
  name: string;
  description: string;
  model: string;
  config: Record<string, any>;
}

export const createAgent = async (cultId: string, params: CreateAgentParams) => {
  const { error, data } = await supabase
    .from('cult_agents')
    .insert([{
      cult_id: cultId,
      name: params.name,
      description: params.description,
      model: params.model,
      config: params.config,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const listAgents = async (cultId: string) => {
  const { error, data } = await supabase
    .from('cult_agents')
    .select('*')
    .eq('cult_id', cultId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};