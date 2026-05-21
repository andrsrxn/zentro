'use client'

import { AUTH, type AuthProvider } from '@zentro/constants/auth'
import { useEffect, useState } from 'react'
import { GitHubIcon } from '@/components/icons/github'
import { GoogleIcon } from '@/components/icons/google'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { authClient } from '@/lib/services/auth-client'
import { signInWith } from '@/lib/utils/auth'
import { cn } from '@/lib/utils/theme'

export function SignInForm({
  className,
  onSuccess,
  onCancel,
  ...props
}: React.ComponentProps<'form'> & {
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider | undefined>()
  const lastMethod = authClient.getLastUsedLoginMethod()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const wasGoogle = mounted && lastMethod === 'google'
  const wasGithub = mounted && lastMethod === 'github'
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <Field>
          <Button
            variant='outline'
            type='button'
            size='lg'
            className='relative overflow-hidden'
            onClick={async () => {
              setIsLoading(true)
              setSelectedProvider(AUTH.providers.github)
              await signInWith(AUTH.providers.github)
            }}
            disabled={isLoading}>
            <GitHubIcon />
            {selectedProvider === AUTH.providers.github && isLoading
              ? 'Signing...'
              : 'Continue with GitHub'}
            {wasGithub ? (
              <Badge
                className='bg-muted absolute -top-0.5 -right-0.5 rounded-t-none rounded-b-md'
                variant='outline'>
                Last Used
              </Badge>
            ) : null}
          </Button>
          <Button
            variant='outline'
            type='button'
            size='lg'
            className='relative overflow-hidden'
            onClick={async () => {
              setIsLoading(true)
              setSelectedProvider(AUTH.providers.google)
              await signInWith(AUTH.providers.google)
            }}
            disabled={isLoading}>
            <GoogleIcon />
            {selectedProvider === AUTH.providers.google && isLoading
              ? 'Signing...'
              : 'Continue with Google'}
            {wasGoogle ? (
              <Badge
                className='bg-muted absolute -top-0.5 -right-0.5 rounded-t-none rounded-b-md'
                variant='outline'>
                Last Used
              </Badge>
            ) : null}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
