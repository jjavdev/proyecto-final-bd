import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'

interface Props {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'small', md: 'medium', lg: 'large' } as const

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Rating
        value={value}
        onChange={(_, newVal) => {
          if (!readonly && newVal !== null) onChange?.(newVal)
        }}
        readOnly={readonly}
        size={sizeMap[size]}
        icon={<StarIcon sx={{ color: '#FFD700', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }} />}
        emptyIcon={<StarIcon sx={{ color: 'rgba(255,255,255,0.15)' }} />}
        highlightSelectedOnly
      />
    </Box>
  )
}
