'use client'

import { AUTH, type AuthProvider } from '@zentro/constants/auth'
import { useState } from 'react'
import { GitHubIcon } from '@/components/icons/github'
import { GoogleIcon } from '@/components/icons/google'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
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

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <Field>
          <Button
            variant='outline'
            type='button'
            size='lg'
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
          </Button>
          <Button
            variant='outline'
            type='button'
            size='lg'
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
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
