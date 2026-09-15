import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../src/App.tsx'

afterEach(cleanup)

describe('App', () => {
  it('renders the kit name as the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('adlc-kit-ts')
  })
})
