import Together from 'together-ai';

// Check if we're on the server side
const isServer = typeof window === 'undefined';

// Only create the client on the server side
export const together = isServer 
  ? new Together({
      apiKey: process.env.TOGETHER_API_KEY || process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
    })
  : null;

// Helper function to ensure we have a client
export function getTogetherClient() {
  if (!together) {
    throw new Error('Together client can only be used on the server side');
  }
  return together;
}