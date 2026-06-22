/** biome-ignore-all lint/nursery/useConsistentTestIt: API convention */
import { expect, test } from '@playwright/test'

test.describe('Notes CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as guest before running notes tests
    await page.goto('/')
    await page.getByRole('button', { name: 'Continue as Guest' }).click()
    // Wait for the authenticated view
    await page.waitForTimeout(5000)
    await expect(page.locator('header [data-slot="avatar"]')).toBeVisible({ timeout: 10_000 })
  })

  test('should create, read, update color, and delete a note', async ({ page }) => {
    const testTitle = `E2E Test Note ${Date.now()}`
    const testContent = 'This is the content for the E2E test note.'

    // CREATE
    // Open the create note modal
    await page.getByRole('button', { name: /Create Note/iu }).click()

    // Fill the form
    await page.getByPlaceholder('Note title...').fill(testTitle)
    await page.getByPlaceholder('Additional details... (optional)').fill(testContent)

    // Click submit
    await page.getByRole('button', { name: 'Create Note' }).click()

    // The modal should close and note should appear in the list
    const newNote = page.locator('[data-slot="sticky-note"]', { hasText: testTitle })
    await expect(newNote).toBeVisible()

    // READ
    await expect(newNote).toContainText(testContent)

    // UPDATE (Color)
    // Find the dropdown trigger (IconDots) within the note
    const dropdownTrigger = newNote.locator('button', { has: page.locator('svg.tabler-icon-dots') })

    await dropdownTrigger.click()

    // Open color submenu
    await page.getByRole('menuitem', { name: 'Color' }).hover()

    // Choose a different color, we click the second one (assuming default is the first)
    // The component sets aria-label to capitalized key, e.g., 'Yellow', 'Blue'
    await page.getByRole('menuitem', { name: 'Blue' }).click()

    // Assert that the color changed
    // The background color of the StickyNote should be updated. We check the style attribute.
    // Wait for the background to change (optimistic update might take a frame, network might take more)
    await expect(newNote).toHaveAttribute('style', /color: rgb\(13, 43, 62\)/iu, { timeout: 5000 })

    // DELETE - re-query the trigger after the note re-rendered
    // Escape any lingering state
    await page.keyboard.press('Escape')

    const newNoteTwo = page.locator('[data-slot="sticky-note"]', { hasText: testTitle })
    await expect(newNoteTwo).toBeVisible()

    // READ
    await expect(newNoteTwo).toContainText(testContent)

    // Find the dropdown trigger (IconDots) within the note
    const dropdownTriggerTwo = newNoteTwo.locator('button', {
      has: page.locator('svg.tabler-icon-dots'),
    })

    await dropdownTriggerTwo.click()

    await page.getByRole('menuitem', { name: 'Delete' }).click()

    // Confirm deletion
    await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(newNoteTwo).not.toBeVisible()
  })
})
