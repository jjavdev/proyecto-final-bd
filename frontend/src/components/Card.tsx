import { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 20 }}>
      {title && <h3 style={{ margin: '0 0 15px 0', color: '#1a1a2e' }}>{title}</h3>}
      {children}
    </div>
  )
}
