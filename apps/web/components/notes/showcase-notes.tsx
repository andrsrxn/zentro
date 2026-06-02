import { NOTES } from '@zentro/constants/notes'
import {
  StickyNote,
  StickyNoteContent,
  StickyNoteFooter,
  StickyNoteTitle,
} from '@/components/notes/sticky-note'

const SHOWCASE_NOTES = [
  {
    id: 'demo-note-1',
    title: 'Gym after work',
    content: '',
    color: NOTES.colors.blue.background,
    className:
      'animate-zoom-in absolute -bottom-2 left-1/2 w-[230px] translate-x-[-280px] -rotate-3 cursor-default hover:-translate-y-3 md:w-[260px] md:translate-x-[-340px] md:rotate-2',
    createdAt: new Date('2026-05-26T09:15:00-06:00'),
  },
  {
    id: 'demo-note-2',
    title: 'Dinner reservation',
    content: "Book the restaurant for dad's birthday on Saturday",
    color: NOTES.colors.yellow.background,
    className:
      'animate-zoom-in absolute -bottom-4 left-1/2 w-[230px] -translate-x-1/2 -rotate-8 cursor-default opacity-0 [animation-delay:100ms] hover:-translate-y-3 md:w-[260px]',
    createdAt: new Date('2026-05-28T14:30:22-06:00'),
  },
  {
    id: 'demo-note-3',
    title: 'Shopping list',
    content: 'Milk, eggs, bread, cheese',
    color: NOTES.colors.green.background,
    className:
      'animate-zoom-in absolute right-1/2 -bottom-3 w-[230px] translate-x-[300px] rotate-4 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:w-[260px] md:translate-x-[360px]',
    createdAt: new Date('2026-05-30T10:45:10-06:00'),
  },
  {
    id: 'demo-note-4',
    title: 'Call mom',
    content: 'Remind her about the dental appointment next week',
    color: NOTES.colors.blue.background,
    className:
      'animate-zoom-in absolute right-1/2 -bottom-3 hidden w-[230px] translate-x-[580px] -rotate-2 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:flex md:w-[260px]',
    createdAt: new Date('2026-05-31T16:20:05-06:00'),
  },
  {
    id: 'demo-note-5',
    title: 'Project meeting notes',
    content: 'Follow up with team on Q3 goals, review analytics, and prepare presentation',
    color: NOTES.colors.orange.background,
    className:
      'animate-zoom-in absolute -bottom-18 left-1/2 hidden w-[230px] translate-x-[-555px] rotate-2 cursor-default opacity-0 [animation-delay:200ms] hover:-translate-y-3 md:flex lg:-bottom-8 lg:w-[280px] lg:translate-x-[-600px]',
    createdAt: new Date('2026-06-01T08:05:30-06:00'),
  },
]

export const ShowcaseNotes = () => {
  return (
    <div className='fixed bottom-0 left-0 w-full lg:-bottom-3' aria-hidden>
      {SHOWCASE_NOTES.map(note => (
        <StickyNote
          key={note.id}
          color={note.color}
          id={note.id}
          disabled
          aria-hidden
          tabIndex={-1}
          className={note.className}>
          <StickyNoteTitle
            className='pointer-events-none select-none'
            color={note.color}
            readOnly
            tabIndex={-1}
            noteId={note.id}>
            {note.title}
          </StickyNoteTitle>
          <StickyNoteContent
            className='pointer-events-none select-none'
            color={note.color}
            readOnly
            tabIndex={-1}
            noteId={note.id}>
            {note.content}
          </StickyNoteContent>
          <StickyNoteFooter
            color={note.color}
            createdAt={note.createdAt}
            timeZone='America/Guatemala'
          />
        </StickyNote>
      ))}
    </div>
  )
}
