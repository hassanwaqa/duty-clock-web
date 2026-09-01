import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { searchLocations } from '../api/locations'

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 350

export function useLocationSuggestions(input) {
  const normalizedInput = input.trim()
  const [debouncedInput, setDebouncedInput] = useState('')

  useEffect(() => {
    if (normalizedInput.length < MIN_QUERY_LENGTH) return undefined

    const timer = window.setTimeout(() => setDebouncedInput(normalizedInput), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [normalizedInput])

  const query = normalizedInput.length >= MIN_QUERY_LENGTH ? debouncedInput : ''

  return useQuery({
    queryKey: ['location-suggestions', query.toLocaleLowerCase('en-US')],
    queryFn: ({ signal }) => searchLocations(query, signal),
    enabled: query.length >= MIN_QUERY_LENGTH,
    staleTime: 10 * 60 * 1_000,
    gcTime: 30 * 60 * 1_000,
  })
}
