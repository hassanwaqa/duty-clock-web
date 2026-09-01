import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DUTY_STATUS } from '../../lib/constants'
import LogSheetSet from './LogSheetSet'
import { theme } from '../../theme'

const TRIP = {
  timezone: 'America/Chicago',
  current_cycle_used: 10,
  driver_name: 'Test Driver',
  carrier_name: 'Duty Clock',
  home_terminal: 'Chicago, IL',
  truck_number: 'T-1',
  trailer_number: 'R-1',
  shipping_document: 'BOL-1',
  segments: [
    {
      status: DUTY_STATUS.DRIVING,
      start: '2026-09-01T23:00:00-05:00',
      end: '2026-09-02T01:00:00-05:00',
      location: 'Chicago, IL',
      note: null,
      distance_miles: 120,
    },
  ],
}

afterEach(cleanup)

describe('LogSheetSet', () => {
  it('navigates one screen log at a time while retaining every day for print', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(
      <ThemeProvider theme={theme}>
        <LogSheetSet trip={TRIP} />
      </ThemeProvider>,
    )

    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(within(screen.getByRole('tabpanel')).getByText('Tuesday, September 1, 2026')).toBeTruthy()

    fireEvent.click(screen.getByRole('tab', { name: 'Day 2 · 2026-09-02' }))
    expect(within(screen.getByRole('tabpanel')).getByText('Wednesday, September 2, 2026')).toBeTruthy()
    expect(document.querySelectorAll('.print-log-sheet')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Print logs' }))
    expect(print).toHaveBeenCalledOnce()
  })
})
