// Fix for Next.js 15 type error with dynamic route parameters
import { NextRequest } from 'next/server';

declare module 'next' {
  export interface PageProps {
    params?: Record<string, string>;
  }
}

// Define the handler types with proper param types
export type ApiHandler<Params = Record<string, string>> = (
  req: NextRequest,
  context: { params: Params }
) => Promise<Response> | Response;
