import { toast } from 'sonner'
import type { ExternalToast } from 'sonner'

interface ApiError {
  response?: {
    data?: {
      message?: string
      error?: string
      statusCode?: number
    }
  }
  message?: string
}

export const useToast = () => {
  const showSuccess = (message: string, options?: ExternalToast) => {
    toast.success(message, {
      duration: 3000,
      ...options,
    })
  }

  const showError = (error: unknown, fallbackMessage = 'Ha ocurrido un error', options?: ExternalToast) => {
    const apiError = error as ApiError
    
    let errorMessage = fallbackMessage

    // Extract error message from different possible structures
    if (apiError.response?.data?.message) {
      errorMessage = apiError.response.data.message
    } else if (apiError.response?.data?.error) {
      errorMessage = apiError.response.data.error
    } else if (apiError.message) {
      errorMessage = apiError.message
    }

    // Add status code if available
    const statusCode = apiError.response?.data?.statusCode
    if (statusCode && statusCode >= 400) {
      errorMessage = `[${statusCode}] ${errorMessage}`
    }

    toast.error(errorMessage, {
      duration: 5000, // Errors stay longer
      ...options,
    })
  }

  const showWarning = (message: string, options?: ExternalToast) => {
    toast.warning(message, {
      duration: 4000,
      ...options,
    })
  }

  const showInfo = (message: string, options?: ExternalToast) => {
    toast.info(message, {
      duration: 3000,
      ...options,
    })
  }

  const showLoading = (message: string, options?: ExternalToast) => {
    return toast.loading(message, options)
  }

  const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
    options?: ExternalToast
  ) => {
    return toast.promise(promise, messages, options)
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss,
  }
}
