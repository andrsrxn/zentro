import { IconArrowRight, IconError404 } from '@tabler/icons-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className='flex h-[calc(100dvh-2.75rem)] w-full items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconError404 />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty'>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='link' asChild>
            <Link href='/'>
              Go to Dashboard <IconArrowRight />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
