interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

export default function Table({ columns, data, emptyMsg = 'No hay datos' }: { columns: Column[]; data: any[]; emptyMsg?: string }) {
  if (!data.length) return <p style={{ color: '#888' }}>{emptyMsg}</p>

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead style={{ background: '#1a1a2e', color: '#fff' }}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, textTransform: 'uppercase' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid #eee' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '10px 12px', fontSize: 14 }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
