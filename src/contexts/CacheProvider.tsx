'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

interface CacheProviderProps {
  children: ReactNode
}

export function CacheProvider({ children }: CacheProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        dedupingInterval: 30000,
        focusThrottleInterval: 5000,
        loadingTimeout: 3000,
        // Cache provider with localStorage fallback
        provider: () => {
          // Use in-memory cache as default
          const map = new Map()
          
          // Try to restore from localStorage on mount
          if (typeof window !== 'undefined') {
            try {
              const cachedData = localStorage.getItem('swr-cache')
              if (cachedData) {
                const parsed = JSON.parse(cachedData)
                Object.entries(parsed).forEach(([key, value]) => {
                  map.set(key, value)
                })
              }
            } catch (error) {
              console.error('Error loading cache from localStorage:', error)
            }
            
            // Save to localStorage periodically
            const saveCache = () => {
              try {
                const cacheObj: Record<string, any> = {}
                map.forEach((value, key) => {
                  cacheObj[key] = value
                })
                localStorage.setItem('swr-cache', JSON.stringify(cacheObj))
              } catch (error) {
                console.error('Error saving cache to localStorage:', error)
              }
            }
            
            // Save cache every 30 seconds
            const interval = setInterval(saveCache, 30000)
            
            // Save on page unload
            window.addEventListener('beforeunload', saveCache)
            
            // Cleanup on unmount (store in window to access later)
            if (typeof window !== 'undefined') {
              (window as any).__swrCacheCleanup = () => {
                clearInterval(interval)
                window.removeEventListener('beforeunload', saveCache)
              }
            }
          }
          
          return map
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

