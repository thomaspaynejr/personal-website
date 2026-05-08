import { login } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <main className="max-w-md mx-auto px-6 py-20 flex flex-col justify-center min-h-[80vh]">
      <div className="space-y-6 bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-widest uppercase">Login</h1>
          <p className="text-[10px] text-accent font-bold tracking-[0.2em] uppercase opacity-70">Enter credentials to continue</p>
        </div>

        <form action={login} className="space-y-5">
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-accent uppercase mb-1.5 tracking-widest">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-card/50 border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all"
                placeholder="EMAIL_ADDRESS"
              />
            </div>
            <div>
              <label htmlFor="password" title="Enter your password" className="block text-[10px] font-bold text-accent uppercase mb-1.5 tracking-widest">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-card/50 border border-border-custom rounded-lg px-3 py-2 text-xs outline-none focus:border-action transition-all"
                placeholder="PASSWORD"
              />
            </div>
          </div>

          {searchParams.error && (
            <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded border border-red-500/20">
              Error: {searchParams.error}
            </p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-3 bg-action text-background rounded-lg font-bold hover:opacity-90 transition-all text-[10px] tracking-widest uppercase"
            >
              Sign In _
            </button>
            <div className="text-center">
              <Link href="/signup" className="text-[9px] font-bold text-accent hover:text-foreground underline underline-offset-4 uppercase tracking-widest">
                Need an account? Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
