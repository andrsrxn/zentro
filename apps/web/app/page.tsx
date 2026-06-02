import { COMPANY } from '@zentro/constants/company'
import type { TimeZone } from '@zentro/constants/countries'
import { IMAGES } from '@zentro/constants/media'
import { NOTES } from '@zentro/constants/notes'
import { formatDate } from '@zentro/utils/dates'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/sign-in-form'
import { Notes } from '@/components/notes/notes'
import { NotesPanel } from '@/components/notes/panel'
import {
  StickyNote,
  StickyNoteContent,
  StickyNoteFooter,
  StickyNoteTitle,
} from '@/components/notes/sticky-note'
import { Panel } from '@/components/shared/panel'
import { ShortcutsDialog } from '@/components/shared/shortcuts-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AccountDialog } from '@/components/user/account-dialog'
import { AccountDropdown } from '@/components/user/account-dropdown'
import { getSession } from '@/lib/data/auth'

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: temporal
export default async function Home() {
  const session = await getSession()

  if (!session.data) {
    return (
      <Panel>
        <Card className='animate-in zoom-in-95 fade-in-0 w-full max-w-sm duration-500 ease-in-out lg:mb-26'>
          <CardHeader>
            <div className='mb-1 flex w-full items-center justify-center'>
              <img
                src={IMAGES.brand.symbol.svg}
                alt={`${COMPANY.name} Symbol`}
                className='size-12'
              />
            </div>
            <CardTitle className='w-full text-center text-2xl font-bold'>
              Sign in to {COMPANY.name}
            </CardTitle>
            <CardDescription className='w-full text-center text-pretty'>
              Use an authentication provider to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
          <CardFooter>
            <p className='text-muted-foreground mx-auto w-11/12 text-center text-sm text-pretty'>
              By continuing, you agree to our{' '}
              <Link
                prefetch={false}
                href='/terms'
                className='hover:text-primary underline decoration-1 underline-offset-2'>
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                prefetch={false}
                href='/privacy'
                className='hover:text-primary underline decoration-1 underline-offset-2'>
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className='fixed bottom-0 left-0 w-full lg:-bottom-3' aria-hidden>
          <StickyNote
            color={NOTES.colors.blue.background}
            id='demo-note-1'
            disabled
            className='animate-zoom-in absolute -bottom-2 left-1/2 w-[230px] translate-x-[-280px] -rotate-3 cursor-default hover:-translate-y-3 md:w-[260px] md:translate-x-[-340px] md:rotate-2'>
            <StickyNoteTitle
              className='pointer-events-none select-none'
              color={NOTES.colors.blue.background}
              readOnly
              noteId='demo-note-1'>
              Gym after work
            </StickyNoteTitle>
            <StickyNoteContent
              className='pointer-events-none select-none'
              color={NOTES.colors.blue.background}
              readOnly
              noteId='demo-note-1'
            />
            <StickyNoteFooter
              color={NOTES.colors.blue.background}
              createdAt={new Date('2026-06-01T17:19:42-06:00')}
              timeZone='America/Guatemala'
            />
          </StickyNote>
          <StickyNote
            color={NOTES.colors.yellow.background}
            id='demo-note-2'
            disabled
            className='animate-zoom-in absolute -bottom-4 left-1/2 w-[230px] -translate-x-1/2 -rotate-8 cursor-default opacity-0 [animation-delay:100ms] hover:-translate-y-3 md:w-[260px]'>
            <StickyNoteTitle
              className='pointer-events-none select-none'
              color={NOTES.colors.yellow.background}
              readOnly
              noteId='demo-note-2'>
              Dinner reservation
            </StickyNoteTitle>
            <StickyNoteContent
              className='pointer-events-none select-none'
              color={NOTES.colors.yellow.background}
              readOnly
              noteId='demo-note-2'>
              Book the restaurant for dad's birthday on Saturday
            </StickyNoteContent>
            <StickyNoteFooter
              color={NOTES.colors.yellow.background}
              createdAt={new Date('2026-06-01T17:19:42-06:00')}
              timeZone='America/Guatemala'
            />
          </StickyNote>
          <StickyNote
            color={NOTES.colors.green.background}
            id='demo-note-3'
            disabled
            className='animate-zoom-in absolute right-1/2 -bottom-3 w-[230px] translate-x-[300px] rotate-4 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:w-[260px] md:translate-x-[360px]'>
            <StickyNoteTitle
              className='pointer-events-none select-none'
              color={NOTES.colors.green.background}
              readOnly
              noteId='demo-note-3'>
              Shopping list
            </StickyNoteTitle>
            <StickyNoteContent
              className='pointer-events-none select-none'
              color={NOTES.colors.green.background}
              readOnly
              noteId='demo-note-3'>
              Milk, eggs, bread, cheese
            </StickyNoteContent>
            <StickyNoteFooter
              color={NOTES.colors.green.background}
              createdAt={new Date('2026-06-01T17:19:42-06:00')}
              timeZone='America/Guatemala'
            />
          </StickyNote>
          <StickyNote
            color={NOTES.colors.blue.background}
            id='demo-note-4'
            disabled
            className='animate-zoom-in absolute right-1/2 -bottom-3 hidden w-[230px] translate-x-[580px] -rotate-2 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:flex md:w-[260px]'>
            <StickyNoteTitle
              className='pointer-events-none select-none'
              color={NOTES.colors.blue.background}
              readOnly
              noteId='demo-note-4'>
              Call mom
            </StickyNoteTitle>
            <StickyNoteContent
              className='pointer-events-none select-none'
              color={NOTES.colors.blue.background}
              readOnly
              noteId='demo-note-4'>
              Remind her about the dental appointment next week
            </StickyNoteContent>
            <StickyNoteFooter
              color={NOTES.colors.blue.background}
              createdAt={new Date('2026-06-01T17:19:42-06:00')}
              timeZone='America/Guatemala'
            />
          </StickyNote>
          <StickyNote
            color={NOTES.colors.orange.background}
            id='demo-note-5'
            disabled
            className='animate-zoom-in absolute -bottom-18 left-1/2 hidden w-[230px] translate-x-[-555px] rotate-2 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:flex lg:-bottom-8 lg:w-[280px] lg:translate-x-[-600px]'>
            <StickyNoteTitle
              className='pointer-events-none select-none'
              color={NOTES.colors.orange.background}
              readOnly
              noteId='demo-note-5'>
              Project meeting notes
            </StickyNoteTitle>
            <StickyNoteContent
              className='pointer-events-none select-none'
              color={NOTES.colors.orange.background}
              readOnly
              noteId='demo-note-5'>
              Follow up with team on Q3 goals, review analytics, and prepare presentation
            </StickyNoteContent>
            <StickyNoteFooter
              color={NOTES.colors.orange.background}
              createdAt={new Date('2026-06-01T17:19:42-06:00')}
              timeZone='America/Guatemala'
            />
          </StickyNote>
        </div>
      </Panel>
    )
  }

  return (
    <section className='min-h-dvh w-full'>
      <header className='animate-in fade-in fixed top-0 left-0 z-50 w-full duration-500 ease-in-out'>
        <div className='wrapper bg-card m-4 flex h-11 max-w-3xl items-center justify-between rounded-full border px-3 shadow-xl/5'>
          <div className='flex h-full items-center pl-1'>
            <img
              src={IMAGES.brand.logo.svg}
              alt={`${COMPANY.name} Logo`}
              className='h-6 dark:hidden'
            />
            <img
              src={IMAGES.brand.logoAlternative.svg}
              alt={`${COMPANY.name} Logo`}
              className='hidden h-6 dark:block'
            />
          </div>
          <div className='-mr-1 flex items-center gap-3'>
            <time
              className='mr-1 text-sm font-medium'
              dateTime={new Date().toISOString()}
              title={formatDate({
                date: new Date(),
                timeZone: session.data.user.timeZone as TimeZone,
              })}>
              {formatDate({
                includeWeekDay: true,
                date: new Date(),
                timeZone: session.data.user.timeZone as TimeZone,
              })}
            </time>

            <AccountDropdown
              name={session.data.user.name}
              email={session.data.user.email}
              avatar={session.data.user.image ?? undefined}
              countryCode={session.data.user.countryCode}
            />
          </div>
        </div>
      </header>
      <NotesPanel>
        <Notes />
      </NotesPanel>

      <ShortcutsDialog />
      <AccountDialog />
    </section>
  )
}
