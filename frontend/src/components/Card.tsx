import { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="glass-card mb-6">
      {title && <h3 className="font-headline text-headline-md font-semibold mb-6 text-on-surface">{title}</h3>}
      {children}
    </div>
  )
}
