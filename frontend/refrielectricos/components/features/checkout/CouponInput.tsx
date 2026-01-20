'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface ValidateCouponResponse {
  valid: boolean
  message: string
  discountAmount: number
  finalTotal: number
  couponId: string
}

interface CouponInputProps {
  cartTotal: number
  onCouponApplied: (data: {
    code: string
    discountAmount: number
    finalTotal: number
  }) => void
  onCouponRemoved: () => void
}

export function CouponInput({
  cartTotal,
  onCouponApplied,
  onCouponRemoved,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const handleApplyCoupon = async () => {
    if (!code.trim()) {
      setError('Por favor ingresa un código de cupón')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post<ValidateCouponResponse>(
        '/coupons/validate',
        {
          code: code.trim().toUpperCase(),
          cartTotal,
        }
      )

      if (response.data.valid) {
        setSuccess(response.data.message)
        setAppliedCoupon(code.trim().toUpperCase())
        onCouponApplied({
          code: code.trim().toUpperCase(),
          discountAmount: response.data.discountAmount,
          finalTotal: response.data.finalTotal,
        })
      } else {
        setError(response.data.message)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al validar el cupón. Por favor intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCode('')
    setAppliedCoupon(null)
    setSuccess(null)
    setError(null)
    onCouponRemoved()
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código de cupón"
          disabled={loading || !!appliedCoupon}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !appliedCoupon) {
              handleApplyCoupon()
            }
          }}
        />
        {appliedCoupon ? (
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Remover
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={loading || !code.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Validando...' : 'Aplicar'}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {success}
          </p>
        </div>
      )}
    </div>
  )
}
