// Fix for Next.js 15 type error with dynamic route parameters
import { NextRequest } from 'next/server';

// Override the Next.js internal types to fix the Promise<any> issue
declare module 'next/dist/server/app-render/entry-base' {
  interface RouteContext {
    params: Record<string, string | string[]>;
  }
}

declare module 'next/dist/compiled/next-server/app-route' {
  interface ParamCheck<T> {
    __param_type__: { params: Record<string, string | string[]> };
  }
}

// Define the handler types with proper param types
export type ApiHandler<Params = Record<string, string>> = (
  req: NextRequest,
  context: { params: Params }
) => Promise<Response> | Response;
