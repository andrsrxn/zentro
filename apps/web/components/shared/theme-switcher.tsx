'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <Button
        suppressHydrationWarning
        size={'icon'}
        aria-label={`Change theme to ${resolvedTheme === 'dark' ? 'light' : 'dark'}`}
        title={`Change theme to ${resolvedTheme === 'dark' ? 'light' : 'dark'}`}
        variant={'outline'}
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        <IconSun className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <IconMoon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      </Button>
    </div>
  )
}
