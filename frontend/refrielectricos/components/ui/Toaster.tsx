'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useTheme } from 'next-themes'

export function Toaster() {
  const { theme } = useTheme()

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-800 group-[.toaster]:border-gray-200 group-[.toaster]:dark:border-gray-700',
          title: 'group-[.toast]:text-gray-900 group-[.toast]:dark:text-gray-100',
          description: 'group-[.toast]:text-gray-500 group-[.toast]:dark:text-gray-400',
          actionButton: 'group-[.toast]:bg-blue-600 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:dark:bg-gray-700',
          closeButton: 'group-[.toast]:bg-white group-[.toast]:dark:bg-gray-800 group-[.toast]:border-gray-200 group-[.toast]:dark:border-gray-700',
          error: 'group-[.toast]:border-red-200 group-[.toast]:dark:border-red-900',
          success: 'group-[.toast]:border-green-200 group-[.toast]:dark:border-green-900',
          warning: 'group-[.toast]:border-yellow-200 group-[.toast]:dark:border-yellow-900',
          info: 'group-[.toast]:border-blue-200 group-[.toast]:dark:border-blue-900',
        },
      }}
    />
  )
}
