import TableContainer from '@mui/material/TableContainer'
import TableMui from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

export default function Table({ columns, data, emptyMsg = 'No hay datos' }: { columns: Column[]; data: any[]; emptyMsg?: string }) {
  if (!data.length) {
    return (
      <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        {emptyMsg}
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <TableMui>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={row.id || i}
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMui>
    </TableContainer>
  )
}
