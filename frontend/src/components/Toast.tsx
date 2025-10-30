import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

interface ToastProps {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  return createPortal(
    <div
      className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
        type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'
      }`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
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