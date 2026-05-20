'use client'

import { IconKeyboard, IconLogout2, IconMoon, IconSun, IconUser } from '@tabler/icons-react'
import type { CountryCode } from '@zentro/constants/countries'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { type ComponentProps, useState } from 'react'
import { HeaderCountryFlag } from '@/components/shared/country-flag'
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
import { signOut } from '@/lib/mutations/auth'
import { useSharedStore } from '@/lib/store/shared'
import { useUserStore } from '@/lib/store/user'
import { getCountryName } from '@/lib/utils/geolocation'

export const AccountDropdown = ({
  avatar,
  name,
  email,
  countryCode,
  ...props
}: {
  avatar?: string
  name?: string
  email: string
  countryCode: string
} & ComponentProps<typeof DropdownMenu>) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setShortcutsDialogOpen = useSharedStore(state => state.setShortcutsDialogOpen)
  const setAccountDialogOpen = useUserStore(state => state.setAccountDialogOpen)
  const { resolvedTheme, setTheme } = useTheme()

  const handleSignOut = async () => {
    setIsLoading(true)
    const res = await signOut()
    if (res.data?.success) {
      router.refresh()
    }
  }
  return (
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
              {name && <span className='truncate font-medium'>{name}</span>}

              <span className='truncate text-xs'>{email}</span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
