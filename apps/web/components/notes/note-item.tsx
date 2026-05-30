import { IconDots, IconPalette, IconTrash } from '@tabler/icons-react'
import type { TimeZone } from '@zentro/constants/countries'
import { NOTES, type Note } from '@zentro/constants/notes'
import { type ComponentProps, useRef } from 'react'
import {
  StickyNote,
  StickyNoteContent,
  StickyNoteFooter,
  StickyNoteTitle,
} from '@/components/notes/sticky-note'
import { AlertDialogConfirm } from '@/components/ui/alert-dialog-confirm'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/lib/hooks/use-confirm'
import { useDeleteNote, useUpdateNote } from '@/lib/hooks/use-notes'
import { authClient } from '@/lib/services/auth-client'
import { capitalizeFirstLetter } from '@/lib/utils/strings'
import { cn } from '@/lib/utils/theme'

interface NoteItemProps extends Omit<ComponentProps<typeof StickyNote>, 'id' | 'color'> {
  note: Note
}

export const NoteItem = ({ note, index, ...props }: NoteItemProps) => {
  const session = authClient.useSession()
  const timeZone = session.data?.user.timeZone as TimeZone

  const { mutate: deleteNote } = useDeleteNote()
  const { mutate: updateNote } = useUpdateNote()

  const [isConfirmOpen, confirm, handleConfirm, handleCancel] = useConfirm()
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <StickyNote
        {...props}
        group='notes'
        index={index}
        onDoubleClick={e => e.stopPropagation()}
        className={cn('min-h-28')}
        color={note.color}
        id={note.id}>
        <StickyNoteTitle color={note.color} noteId={note.id}>
          {note.title}
        </StickyNoteTitle>
        <StickyNoteContent color={note.color} noteId={note.id}>
          {note.content}
        </StickyNoteContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onFocusCapture={e => {
                triggerRef.current = e.currentTarget
              }}
              className={cn(
                'absolute top-2 right-2 hover:bg-black/10 dark:hover:bg-black/10 dark:hover:text-black',
                note.color === NOTES.colors.black.background &&
                  'hover:bg-white/20! hover:text-white!'
              )}
              variant='ghost'
              size='icon'>
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={e => {
              if (isConfirmOpen) {
                e.preventDefault()
              }
            }}
            className='w-20'
            align='end'
            side='bottom'>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPalette />
                  Color
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {Object.entries(NOTES.colors).map(([key, value]) => (
                      <DropdownMenuItem
                        key={key}
                        aria-label={capitalizeFirstLetter(key)}
                        className={cn(
                          value.background === note.color && 'bg-primary/10 focus:bg-primary/15'
                        )}
                        onSelect={() => {
                          if (value.background === note.color) {
                            return
                          }
                          updateNote({ id: note.id, input: { color: value.background } })
                        }}>
                        <div
                          className='h-5 w-full rounded-sm border'
                          style={{ backgroundColor: value.background }}
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                onSelect={async () => {
                  const confirmed = await confirm()
                  if (confirmed) {
                    deleteNote({ id: note.id })
                  }
                }}
                variant='destructive'>
                <IconTrash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <StickyNoteFooter color={note.color} createdAt={note.createdAt} timeZone={timeZone} />
      </StickyNote>
      <AlertDialogConfirm
        open={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title='Delete Note'
        message='Are you sure you want to delete this note? This action cannot be undone.'
        confirmButton='Delete'
        returnFocusRef={triggerRef}
      />
    </>
  )
}
