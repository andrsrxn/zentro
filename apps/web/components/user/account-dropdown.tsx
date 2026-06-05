'use client'

import {
  IconKeyboard,
  IconLogout2,
  IconMoon,
  IconSun,
  IconTrash,
  IconUser,
} from '@tabler/icons-react'
import { useTheme } from '@teispace/next-themes'
import type { CountryCode } from '@zentro/constants/countries'
import { type ComponentProps, useRef, useState } from 'react'
import { HeaderCountryFlag } from '@/components/shared/country-flag'
import { AlertDialogConfirm } from '@/components/ui/alert-dialog-confirm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteAnonymousAccount, useSignOut } from '@/lib/hooks/use-auth'
import { useConfirm } from '@/lib/hooks/use-confirm'
import { useSharedStore } from '@/lib/store/shared'
import { useUserStore } from '@/lib/store/user'
import { getCountryName } from '@/lib/utils/geolocation'

export const AccountDropdown = ({
  avatar,
  name,
  email,
  countryCode,
  isAnonymous = false,
  ...props
}: {
  avatar?: string
  name?: string
  email?: string
  countryCode: string
  isAnonymous?: boolean
} & ComponentProps<typeof DropdownMenu>) => {
  const [isLoading, setIsLoading] = useState(false)
  const setShortcutsDialogOpen = useSharedStore(state => state.setShortcutsDialogOpen)
  const setAccountDialogOpen = useUserStore(state => state.setAccountDialogOpen)
  const { resolvedTheme, setTheme } = useTheme()
  const { signOut } = useSignOut()
  const { deleteAnonymousAccount } = useDeleteAnonymousAccount()
  const [isConfirmOpen, confirm, handleConfirm, handleCancel] = useConfirm()

  const triggerRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    setIsLoading(true)

    await signOut()
  }

  const handleDeleteAccount = async () => {
    const confirmed = await confirm()
    if (confirmed) {
      setIsLoading(true)

      const res = await deleteAnonymousAccount()

      if (res.error) {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className='rounded-full'
            title={`${name}'s profile`}>
            <Avatar className='size-full border'>
              <AvatarImage
                className='aspect-square'
                src={avatar}
                alt={`${name}'s profile`}
                referrerPolicy='no-referrer'
              />
              <AvatarFallback>
                <IconUser className='text-foreground' />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-56' side={'bottom'} align='end' sideOffset={4}>
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
              <Avatar className='size-8'>
                <AvatarImage src={avatar} alt={`${name}'s profile`} referrerPolicy='no-referrer' />
                <AvatarFallback>
                  <IconUser className='text-foreground size-4' />
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                {name ? <span className='truncate font-medium'>{name}</span> : null}
                {email ? <span className='truncate text-xs'>{email}</span> : null}
              </div>
            </div>
          </DropdownMenuLabel>
          <span className="pointer-events-none relative flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <HeaderCountryFlag countryCode={countryCode} className='w-4 rounded-xs' />
            From {getCountryName(countryCode as CountryCode)?.nativeName ?? countryCode}
          </span>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setAccountDialogOpen(true)}>
              <IconUser />
              Account
              <DropdownMenuShortcut>A</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShortcutsDialogOpen(true)}>
              <IconKeyboard />
              Shortcuts
              <DropdownMenuShortcut>K</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }}>
              <IconMoon className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
              <IconSun className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
              Change to {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
              <DropdownMenuShortcut>D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {isAnonymous ? (
            <DropdownMenuItem
              variant='destructive'
              onFocusCapture={e => {
                triggerRef.current = e.currentTarget
              }}
              onClick={async e => {
                e.preventDefault()
                await handleDeleteAccount()
              }}
              disabled={isLoading}>
              <IconTrash />
              {isLoading ? 'Deleting account...' : 'Delete account'}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant='destructive'
              onClick={async e => {
                e.preventDefault()
                await handleSignOut()
              }}
              disabled={isLoading}>
              <IconLogout2 />
              {isLoading ? 'Signing out...' : 'Log out'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogConfirm
        open={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title='Delete Account'
        message='Are you sure you want to delete your account? This action cannot be undone.'
        confirmButton='Delete'
        returnFocusRef={triggerRef}
      />
    </>
  )
}
