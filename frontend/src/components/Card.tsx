import { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="card card-custom p-4 mb-4">
      {title && <h3 className="mb-3" style={{ color: '#1a1a2e', fontWeight: 700 }}>{title}</h3>}
      {children}
    </div>
  )
}
