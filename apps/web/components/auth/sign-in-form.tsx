'use client'

import { IconInfoCircle, IconUser } from '@tabler/icons-react'
import { AUTH, type AuthProvider } from '@zentro/constants/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GitHubIcon } from '@/components/icons/github'
import { GoogleIcon } from '@/components/icons/google'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { signInAnonymous, signInWith } from '@/lib/mutations/auth'
import { authClient } from '@/lib/services/auth-client'
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
  const { refresh } = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignInAnonymous = async () => {
    setIsLoading(true)
    setSelectedProvider(AUTH.providers.anonymous)
    const result = await signInAnonymous()

    if (result.data?.user) {
      onSuccess?.()
      refresh()
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true)
    setSelectedProvider(AUTH.providers.google)
    const result = await signInWith(AUTH.providers.google)
    if (result.data) {
      onSuccess?.()
    }
  }

  const handleSignInWithGithub = async () => {
    setIsLoading(true)
    setSelectedProvider(AUTH.providers.github)
    const result = await signInWith(AUTH.providers.github)
    if (result.data) {
      onSuccess?.()
    }
  }

  const wasGoogle = mounted && lastMethod === 'google'
  const wasGithub = mounted && lastMethod === 'github'

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={e => e.preventDefault()}
      {...props}>
      <FieldGroup>
        <Field>
          <Button
            variant='outline'
            type='button'
            size='lg'
            className='relative overflow-hidden'
            onClick={handleSignInWithGithub}
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
            onClick={handleSignInWithGoogle}
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
          <div className='flex w-full gap-2'>
            <Button
              variant='outline'
              type='button'
              size='lg'
              className='relative flex-1 overflow-hidden'
              onClick={handleSignInAnonymous}
              disabled={isLoading}>
              <IconUser />
              {selectedProvider === AUTH.providers.anonymous && isLoading
                ? 'Signing...'
                : 'Continue as Guest'}
            </Button>
            <Tooltip>
              <TooltipTrigger type='button'>
                <IconInfoCircle className='text-muted-foreground size-5' />
              </TooltipTrigger>
              <TooltipContent className='w-42'>
                <p className='text-center text-pretty'>For demo only purposes, one use account</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
