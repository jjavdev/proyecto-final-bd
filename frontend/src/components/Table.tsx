interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

export default function Table({ columns, data, emptyMsg = 'No hay datos' }: { columns: Column[]; data: any[]; emptyMsg?: string }) {
  if (!data.length) return <p className="text-on-surface-variant text-center py-4">{emptyMsg}</p>

  return (
    <div className="table-responsive">
      <table className="table-custom">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col) => (
                <td key={col.key}>
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
