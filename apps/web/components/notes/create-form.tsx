'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { NOTES, type NoteBackgroundColor, noteBackgroundColors } from '@zentro/constants/notes'
import { type CreateNoteInput, createNoteSchema } from '@zentro/schemas/notes'
import { type ComponentProps, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useCreateNote } from '@/lib/hooks/use-notes'
import { getNoteForegroundColor } from '@/lib/utils/notes'
import { cn } from '@/lib/utils/theme'

export function CreateNoteForm({
  onSuccess,
  onCancel,
  onColorChange,
  defaultValues = {
    title: '',
    content: '',
    color: NOTES.defaultNoteColor.background,
    positionX: 0,
    positionY: 0,
  },
  ...props
}: {
  onSuccess?: () => void
  onCancel?: () => void
  onColorChange?: (color: NoteBackgroundColor) => void
  defaultValues?: CreateNoteInput
} & ComponentProps<'form'>) {
  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues,
  })
  const [color, setColor] = useState<NoteBackgroundColor>(defaultValues.color)
  const fgColor = getNoteForegroundColor(color)

  const { mutate: createNote } = useCreateNote()

  function onSubmit(data: CreateNoteInput) {
    form.reset()
    onSuccess?.()

    createNote({ input: data })
  }

  function handleColorChange(color: NoteBackgroundColor) {
    onColorChange?.(color)
    setColor(color)
  }

  function handleOnCancel() {
    form.reset()
    onCancel?.()
  }

  return (
    <form id='create-note-form' onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <FieldGroup>
        <Controller
          name='title'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-note-title-form' className='sr-only'>
                Title
              </FieldLabel>
              <Input
                {...field}
                className='font-handwritten border-none bg-transparent p-0 px-2 text-2xl! focus-visible:ring-0 dark:placeholder:text-neutral-500'
                id='create-note-title-form'
                aria-invalid={fieldState.invalid}
                style={{ color: fgColor }}
                placeholder='Note title...'
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='content'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-note-content-form' className='sr-only'>
                Additional details <span className='text-muted-foreground'>(optional)</span>
              </FieldLabel>

              <Textarea
                {...field}
                style={{ color: fgColor }}
                className='max-h-32 min-h-24 resize-none border-none p-0 px-2 text-base focus-visible:ring-0 dark:placeholder:text-neutral-500'
                id='create-note-content-form'
                placeholder='Additional details... (optional)'
                rows={6}
                maxLength={500}
                aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor='create-note-color-form' className='sr-only'>
                Color
              </FieldLabel>
              <RadioGroup
                {...field}
                onValueChange={(value: NoteBackgroundColor) => {
                  field.onChange(value)
                  handleColorChange(value)
                }}
                className='flex justify-between gap-2'>
                {noteBackgroundColors.map((color, index) => (
                  <div key={color}>
                    <Label
                      className={cn(
                        'has-focus-within:ring-primary/40 size-8 cursor-pointer rounded-full border transition has-focus-within:ring-3',
                        field.value === color && 'border-primary ring-primary/40 border-2 ring-3'
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
        <Field orientation='horizontal' className='justify-end'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={handleOnCancel}>
              Cancel
            </Button>
          )}
          <Button type='submit'>Create Note</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
