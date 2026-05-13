'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { NOTES, noteBackgroundColors } from '@zentro/constants/notes'
import { type CreateNoteInput, createNoteSchema } from '@zentro/schemas/notes'
import type { ComponentProps } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateNote } from '@/lib/hooks/use-notes'
import { cn } from '@/lib/utils/theme'

export function CreateNoteForm({
  onSuccess,
  onCancel,
  defaultValues = {
    title: 'Reminder',
    content: '',
    color: NOTES.colors.yellow.background,
    positionX: 0,
    positionY: 0,
  },
  ...props
}: {
  onSuccess?: () => void
  onCancel?: () => void
  defaultValues?: CreateNoteInput
} & ComponentProps<'form'>) {
  const { createNote, isPending, error } = useCreateNote()

  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues,
  })

  if (error) {
    toast.error(error.message)
  }

  function onSubmit(data: CreateNoteInput) {
    createNote(data)

    toast.success(NOTES.success.created.message)
    form.reset()
    onSuccess?.()
  }

  return (
    <form id='create-note-form' onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <FieldGroup>
        <Controller
          name='title'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-note-title-form'>Title</FieldLabel>
              <Input
                {...field}
                disabled={isPending}
                id='create-note-title-form'
                aria-invalid={fieldState.invalid}
                placeholder='Reminder...'
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='color'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-note-color-form'>Color</FieldLabel>
              <RadioGroup
                {...field}
                disabled={isPending}
                onValueChange={field.onChange}
                className='flex justify-between gap-2'>
                {noteBackgroundColors.map((color, index) => (
                  <div key={color}>
                    <Label
                      className={cn(
                        'has-focus-within:ring-primary/40 size-8 cursor-pointer rounded-full border transition has-focus-within:ring-3',
                        field.value === color && 'border-primary border-2'
                      )}
                      style={{ backgroundColor: color }}>
                      <RadioGroupItem className='opacity-0!' id={`color-${index}`} value={color} />
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='content'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-note-content-form'>
                Content <span className='text-muted-foreground'>(optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  disabled={isPending}
                  id='create-note-content-form'
                  placeholder='Always start with positive thoughts...'
                  rows={6}
                  maxLength={500}
                  className='min-h-24 resize-none'
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align='block-end'>
                  <InputGroupText className='tabular-nums'>
                    {field.value?.length ?? 0}/500 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation='horizontal' className='justify-end'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              disabled={isPending}
              onClick={() => {
                form.reset()
                onCancel()
              }}>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Note'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
