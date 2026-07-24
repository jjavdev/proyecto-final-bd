import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

interface ChoferStats {
  saldo_pendiente: number
  saldo_pagado: number
}

interface BalanceContextType {
  saldo: number | null
  choferStats: ChoferStats | null
  loading: boolean
  refreshBalance: () => Promise<void>
}

const BalanceContext = createContext<BalanceContextType>({} as BalanceContextType)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth()
  const [saldo, setSaldo] = useState<number | null>(null)
  const [choferStats, setChoferStats] = useState<ChoferStats | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshBalance = useCallback(async () => {
    if (!usuario) return
    setLoading(true)
    try {
      if (usuario.rol === 'CLIENTE') {
        const res = await api.get('/clientes/saldo')
        setSaldo(res.data.saldo)
      } else if (usuario.rol === 'CHOFER') {
        const res = await api.get('/choferes/stats')
        setChoferStats(res.data)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [usuario])

  return (
    <BalanceContext.Provider value={{ saldo, choferStats, loading, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export const useBalance = () => useContext(BalanceContext)
