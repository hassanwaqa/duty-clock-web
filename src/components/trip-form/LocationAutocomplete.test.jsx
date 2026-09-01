import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LocationOnRounded } from '@mui/icons-material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { resetNetwork, stubNetwork } from '../../test/networkStub'
import LocationAutocomplete from './LocationAutocomplete'

afterEach(() => {
  cleanup()
  resetNetwork()
})

describe('LocationAutocomplete', () => {
  it('debounces provider suggestions and preserves the selected label', async () => {
    const net = stubNetwork({
      body: { results: ['Chicago, IL, USA', 'Chicago Heights, IL, USA'] },
    })
    const onChange = vi.fn()
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    function Probe() {
      const [value, setValue] = useState('')
      return (
        <LocationAutocomplete
          label="Current location"
          placeholder="Chicago, IL"
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue)
            onChange(nextValue)
          }}
          icon={LocationOnRounded}
        />
      )
    }

    render(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Current location' }), {
      target: { value: 'Chic' },
    })

    expect(net.calls).toHaveLength(0)
    await waitFor(() => expect(net.calls).toHaveLength(1))
    expect(net.calls[0]).toMatchObject({
      url: '/api/trips/locations',
      params: { q: 'Chic' },
    })

    fireEvent.click(await screen.findByRole('option', { name: 'Chicago, IL, USA' }))
    expect(onChange).toHaveBeenLastCalledWith('Chicago, IL, USA')
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    expect(net.calls).toHaveLength(1)
  })
})
