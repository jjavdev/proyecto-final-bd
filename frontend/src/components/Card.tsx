import { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 0 20px rgba(61, 255, 163, 0.2)',
      }}
    >
      {title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  )
}
