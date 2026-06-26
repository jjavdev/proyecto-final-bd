import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { usuario } = useAuth()

  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    CHOFER: 'Chofer',
    CLIENTE: 'Cliente',
    PERSONAL_ADMIN: 'Personal Administrativo',
  }

  return (
    <>
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>
        Has iniciado sesión como <strong>{rolNames[usuario?.rol || ''] || usuario?.rol}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <InfoCard label="Email" value={usuario?.email || ''} />
        <InfoCard label="Rol" value={rolNames[usuario?.rol || ''] || usuario?.rol || ''} />
      </div>
    </>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, margin: '5px 0 0 0' }}>{value}</p>
    </div>
  )
}
