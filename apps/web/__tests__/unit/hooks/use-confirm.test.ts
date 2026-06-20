/** biome-ignore-all lint/style/noNonNullAssertion: false positive */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useConfirm } from '@/lib/hooks/use-confirm'

describe('useConfirm', () => {
  it('initializes with isOpen as false', () => {
    const { result } = renderHook(() => useConfirm())
    expect(result.current[0]).toBe(false) // isOpen
  })

  // biome-ignore lint/suspicious/useAwait: API convention
  it('sets isOpen to true when confirm is called', async () => {
    const { result } = renderHook(() => useConfirm())

    // Call confirm without awaiting, to check intermediate state
    let promise: Promise<boolean> | undefined
    act(() => {
      promise = result.current[1]()
    })

    expect(promise).toBeInstanceOf(Promise)

    expect(result.current[0]).toBe(true)
  })

  it('resolves with true when handleConfirm is called', async () => {
    const { result } = renderHook(() => useConfirm())

    let promise: Promise<boolean> | undefined
    act(() => {
      promise = result.current[1]()
    })

    act(() => {
      result.current[2]() // handleConfirm
    })

    const value = await promise!
    expect(value).toBe(true)
    expect(result.current[0]).toBe(false)
  })

  it('resolves with false when handleCancel is called', async () => {
    const { result } = renderHook(() => useConfirm())

    let promise: Promise<boolean> | undefined
    act(() => {
      promise = result.current[1]()
    })

    act(() => {
      result.current[3]() // handleCancel
    })

    const value = await promise!
    expect(value).toBe(false)
    expect(result.current[0]).toBe(false)
  })
})
