'use client'

import { IconKeyboard, IconLogout2, IconSettings, IconUser } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { type ComponentProps, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/mutations/auth'

export const AccountDropdown = ({
  avatar,
  name,
  email,
  ...props
}: {
  avatar?: string
  name?: string
  email: string
} & ComponentProps<typeof DropdownMenu>) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconKeyboard />
            Shortcuts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings />
            Settings
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
