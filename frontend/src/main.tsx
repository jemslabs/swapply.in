
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'




const PUBLISHABLE_KEY = import.meta.env.IS_PRODUCTION ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY : import.meta.env.VITE_CLERK_TEST_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{
    baseTheme: dark,
  }} afterSignInUrl="/browse"
    afterSignUpUrl="/browse">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </ClerkProvider>,
)
