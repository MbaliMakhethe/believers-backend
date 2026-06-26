import Link from "next/link"

export default function ApplicationReceivedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-2xl text-ink">Application received</h1>
        <p className="text-sm text-ink/60 mt-3">
          We review every vendor application by hand — you'll get an email
          once a decision is made, usually within a few business days.
        </p>
        <Link href="/sell/login" className="btn-primary inline-flex mt-8">Back to sign in</Link>
      </div>
    </div>
  )
}
