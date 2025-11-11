import useSWR from 'swr'

// Generic fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  
  const data = await res.json()
  return data
}

// Hook for user profile data with caching
export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/profile',
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate on window focus
      revalidateOnReconnect: true, // Revalidate when reconnecting
      dedupingInterval: 30000, // Dedupe requests within 30 seconds
      refreshInterval: 60000, // Auto refresh every 60 seconds
    }
  )

  return {
    profile: data?.success ? data.data : null,
    isLoading,
    isError: error,
    mutate, // Function to manually revalidate
  }
}

// Hook for generated images list with caching
export function useGeneratedImages(page: number = 1, limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/images/list?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 20000, // Dedupe requests within 20 seconds
      refreshInterval: 0, // Don't auto refresh (manual only)
    }
  )

  return {
    images: data?.success ? data.data : [],
    pagination: data?.pagination || null,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for payment history with caching
export function usePaymentHistory() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/payments/history',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Dedupe requests within 60 seconds
      refreshInterval: 0, // Don't auto refresh
    }
  )

  return {
    payments: data?.success ? data.data : [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for subscription history with caching
export function useSubscriptionHistory() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/subscriptions/history',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Dedupe requests within 60 seconds
      refreshInterval: 0, // Don't auto refresh
    }
  )

  return {
    subscriptions: data?.success ? data.data.subscriptions : [],
    activeSubscription: data?.success ? data.data.active_subscription : null,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for credits balance with caching
export function useCreditsBalance() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/credits/balance',
    fetcher,
    {
      revalidateOnFocus: true, // Always revalidate on focus for credits
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      refreshInterval: 30000, // Auto refresh every 30 seconds
    }
  )

  return {
    balance: data?.success ? data.data : null,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for prompt library with caching
export function usePromptLibrary() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/prompt-library/list',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // Dedupe requests within 2 minutes
      refreshInterval: 0, // Don't auto refresh
    }
  )

  return {
    prompts: data?.success ? data.data : [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Generic cache hook for any API endpoint
export function useCachedAPI<T = any>(
  url: string | null,
  options?: {
    revalidateOnFocus?: boolean
    revalidateOnReconnect?: boolean
    refreshInterval?: number
    dedupingInterval?: number
  }
) {
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      revalidateOnReconnect: options?.revalidateOnReconnect ?? true,
      dedupingInterval: options?.dedupingInterval ?? 30000,
      refreshInterval: options?.refreshInterval ?? 0,
    }
  )

  return {
    data: data as T,
    isLoading,
    isError: error,
    mutate,
  }
}

