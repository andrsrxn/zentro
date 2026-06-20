import { render, screen } from '@testing-library/react'
import { COMPANY } from '@zentro/constants/company'
import { describe, expect, it } from 'vitest'
import Page from '@/app/page'

describe('Page', () => {
  it('renders sign in page', () => {
    render(<Page />)
    expect(screen.getAllByLabelText(`Sign in to ${COMPANY.name}`)).toBeDefined()
  })
})
