export type DeleteUserRequest = {
  userId: string;
};

export type ErrorResponse = {
  error: string;
  details?: string;
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};