// src/lib/getBaseUrl.ts
export const getBaseUrl = () => {
  // If we are on the server, use the internal Docker network address
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:8080/api';
  }
  // If we are on the client, use the relative path which will be handled by the reverse proxy
  return process.env.NEXT_PUBLIC_API_URL || '/api';
};
