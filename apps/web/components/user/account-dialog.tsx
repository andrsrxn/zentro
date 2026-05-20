'use client'

import {
  IconClock,
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceTv,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import { AUTH } from '@zentro/constants/auth'
import type { CountryCode, TimeZone } from '@zentro/constants/countries'
import { formatDate } from '@zentro/utils/dates'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { GitHubIcon } from '@/components/icons/github'
import { GoogleIcon } from '@/components/icons/google'
import { HeaderCountryFlag } from '@/components/shared/country-flag'
import { AlertDialogConfirm } from '@/components/ui/alert-dialog-confirm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useConfirm } from '@/lib/hooks/use-confirm'
import { authClient } from '@/lib/services/auth-client'
import { useUserStore } from '@/lib/store/user'
import { deleteCsrfToken } from '@/lib/utils/csrf'
import { formatUserAgent } from '@/lib/utils/device'
import { getCountryName } from '@/lib/utils/geolocation'
import { capitalizeFirstLetter } from '@/lib/utils/strings'

const UserAgentDisplay = ({ userAgent }: { userAgent: string }) => {
  const { browser, os, deviceType, deviceVendor } = formatUserAgent(userAgent)

  return (
    <span className='flex items-center gap-2 text-sm [&_svg]:size-4'>
      {deviceType === 'mobile' ? (
        <IconDeviceMobile />
      ) : deviceType === 'tablet' ? (
        <IconDeviceTablet />
      ) : deviceType === 'console' ? (
        <IconDeviceGamepad />
      ) : deviceType === 'smarttv' ? (
        <IconDeviceTv />
      ) : (
        <IconDeviceDesktop />
      )}
      <span className='font-medium'>
        {browser}, {deviceVendor} {os}
      </span>
    </span>
  )
}

export const AccountDialog = () => {
  const accountDialogOpen = useUserStore(state => state.accountDialogOpen)
  const setAccountDialogOpen = useUserStore(state => state.setAccountDialogOpen)
  const [isConfirmOpen, confirm, handleConfirm, handleCancel] = useConfirm()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const session = authClient.useSession()
  if (!session.data) {
    return null
  }
  const lastMethod = authClient.getLastUsedLoginMethod()

  return (
    <>
      <Dialog
        open={accountDialogOpen}
        onOpenChange={val => {
          if (isDeleting) {
            return
          }
          setAccountDialogOpen(val)
        }}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription>Get the private details about your account.</DialogDescription>
          </DialogHeader>
          <div className='mt-2 flex gap-8'>
            <Avatar className='size-18 border'>
              <AvatarImage
                className='aspect-square'
                src={session.data.user.image ?? undefined}
                alt={`${session.data.user.name}'s profile`}
                referrerPolicy='no-referrer'
              />
              <AvatarFallback>
                <IconUser className='text-foreground' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-y-3'>
              <span className='truncate text-xl leading-tight font-bold'>
                {session.data.user.name}
              </span>
              <span className='-my-1 truncate text-sm leading-tight'>
                {session.data.user.email}
              </span>
              <Separator className='my-2' />
              {lastMethod ? (
                <span className='flex items-center gap-2 truncate text-sm [&_svg]:size-4'>
                  <IconLock />
                  <span className='text-muted-foreground'>Signed in with</span>
                  {lastMethod === AUTH.providers.github ? <GitHubIcon /> : <GoogleIcon />}
                  <span className='font-medium'>{capitalizeFirstLetter(lastMethod)}</span>
                </span>
              ) : null}
              <span className='truncate text-base'>
                {session.data.session.userAgent ? (
                  <UserAgentDisplay userAgent={session.data.session.userAgent} />
                ) : null}
              </span>
              <span className='flex items-center gap-2 leading-none'>
                <HeaderCountryFlag
                  countryCode={session.data.user.countryCode}
                  className='w-4 rounded-xs'
                />
                {getCountryName(session.data.user.countryCode as CountryCode)?.nativeName ??
                  session.data.user.countryCode}
                <span className='text-muted-foreground'>({session.data.user.timeZone})</span>
              </span>
              <span className='flex items-center gap-2'>
                <IconClock className='size-4' />
                <span className='text-muted-foreground'>Since:</span>
                <span className='font-medium'>
                  {formatDate({
                    date: new Date(session.data.user.createdAt),
                    includeWeekDay: true,
                    timeZone: session.data.user.timeZone as TimeZone,
                  })}
                </span>
              </span>
              <Separator className='mt-2 mb-1' />
              <span>
                <Button
                  variant='destructive'
                  disabled={isDeleting}
                  onClick={async () => {
                    const confirmed = await confirm()
                    if (confirmed) {
                      setIsDeleting(true)

                      const res = await authClient.deleteUser({
                        callbackURL: '/',
                      })

                      if (res.error) {
                        if (res.error.code === 'SESSION_EXPIRED') {
                          toast.error('Session expired, please log in again to delete your account')
                        } else {
                          toast.error('Could not delete account, try again later')
                        }
                        setIsDeleting(false)
                        return
                      }

                      if (res.data?.success) {
                        deleteCsrfToken()

                        router.refresh()
                        authClient.clearLastUsedLoginMethod()
                      }
                    }
                  }}>
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialogConfirm
        open={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title='Delete Account'
        message='Are you sure you want to delete your account? This action cannot be undone.'
        confirmButton='Delete'
      />
    </>
  )
}
