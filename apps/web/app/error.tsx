'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex h-[calc(100dvh-2.75rem)] w-full items-center justify-center'>
      <Empty className='h-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconExclamationCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty'>
            We're sorry, it seems like there's an issue with our servers. Please try again later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={retry}>Try again</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
