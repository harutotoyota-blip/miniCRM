import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

interface ToastProps {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  return createPortal(
    <div className={`toast ${type === 'error' ? 'error' : 'success'}`} role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1 }}>{message}</span>
        <button onClick={onClose} aria-label="Close" className="btn">
          ×
        </button>
      </div>
    </div>,
    document.body
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(
    null
  )

  const showToast = useCallback((message: string, type: 'error' | 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  const closeToast = useCallback(() => setToast(null), [])

  return {
    toast: toast ? <Toast {...toast} onClose={closeToast} /> : null,
    showToast,
  }
}