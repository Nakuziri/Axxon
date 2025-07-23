'use client'
import GoogleLoginButton from '@/components/ui/GoogleLoginButton'

export function Landing() {
  return (
    <div className="landing-page">
      <h1 className="text-4xl mb-4">Welcome to My App Axxon</h1>
      <GoogleLoginButton />
    </div>
  )
}
