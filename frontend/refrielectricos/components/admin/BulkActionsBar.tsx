'use client'

import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void | Promise<void>
    variant?: 'primary' | 'danger' | 'warning'
    loading?: boolean
  }>
}

export function BulkActionsBar({ selectedCount, onClearSelection, actions }: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-600 px-6 py-4 flex items-center gap-4">
        {/* Selection Count */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
            {selectedCount} {selectedCount === 1 ? 'seleccionado' : 'seleccionados'}
          </div>
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Limpiar selección"
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant === 'danger' ? 'primary' : 'primary'}
              size="sm"
              disabled={action.loading}
              className={`${action.variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' : ''} ${action.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {action.loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                action.icon
              )}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
