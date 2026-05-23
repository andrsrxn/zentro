import { COMPANY } from '@zentro/constants/company'
import type { TimeZone } from '@zentro/constants/countries'
import { IMAGES } from '@zentro/constants/media'
import { formatDate } from '@zentro/utils/dates'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/sign-in-form'
import { Notes } from '@/components/notes/notes'
import { NotesPanel } from '@/components/notes/panel'
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

export default async function Home() {
  const session = await getSession()

  if (!session.data) {
    return (
      <Panel>
        <Card className='animate-in zoom-in-95 fade-in-0 w-full max-w-sm duration-500 ease-in-out'>
          <CardHeader>
            <div className='mb-1 flex w-full items-center justify-center'>
              <img src={IMAGES.brand.logo.svg} alt={`${COMPANY.name} Logo`} className='size-12' />
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
      </Panel>
    )
  }

  return (
    <section className='min-h-dvh w-full'>
      <header className='animate-in fade-in fixed top-0 left-0 z-50 w-full duration-500 ease-in-out'>
        <div className='wrapper bg-card m-4 flex h-11 max-w-3xl items-center justify-between rounded-full border px-3 shadow-xl/5'>
          <div className='flex h-full items-center gap-x-2'>
            <img src={IMAGES.brand.logo.svg} alt={`${COMPANY.name} Logo`} className='size-6' />
            <span className='text-lg font-bold'>{COMPANY.name}</span>
          </div>
          <div className='-mr-1 flex items-center gap-3'>
            <time
              className='mr-1 text-sm font-medium'
              dateTime={new Date().toISOString()}
              title={formatDate({
                date: new Date(),
                includeWeekDay: true,
                timeZone: session.data.user.timeZone as TimeZone,
              })}>
              {formatDate({ date: new Date(), timeZone: session.data.user.timeZone as TimeZone })}
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
