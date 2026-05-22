import { render, screen } from '@testing-library/react'
import { COMPANY } from '@zentro/constants/company'
import { expect, test } from 'vitest'
import Page from '@/app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getAllByLabelText(`Sign in to ${COMPANY.name}`)).toBeDefined()
})
