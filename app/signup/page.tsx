import { signup } from '@/app/actions/auth'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <main className="max-w-md mx-auto px-6 py-20 flex flex-col justify-center min-h-[80vh]">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-widest uppercase">Sign Up</h1>
          <p className="text-[10px] text-accent font-bold tracking-[0.2em] uppercase">Create an account to join the community</p>
        </div>

        <form action={signup} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-card border border-border-custom rounded-lg px-4 py-3 text-sm outline-none focus:border-action transition-all"
                placeholder="EMAIL_ADDRESS"
              />
            </div>
            <div>
              <label htmlFor="password" title="Create a password" underline className="block text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-card border border-border-custom rounded-lg px-4 py-3 text-sm outline-none focus:border-action transition-all"
                placeholder="PASSWORD"
              />
            </div>
          </div>

          {searchParams.error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 p-2 rounded border border-red-500/20">
              Error: {searchParams.error}
            </p>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full py-4 bg-action text-background rounded-lg font-bold hover:opacity-90 transition-all text-xs tracking-widest uppercase"
            >
              Join _
            </button>
            <div className="text-center">
              <Link href="/login" className="text-[10px] font-bold text-accent hover:text-foreground underline underline-offset-4 uppercase tracking-widest">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
