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
    await page.getByRole('button', { name: /Create Note/iu }).click()
    await page.getByPlaceholder('Note title...').fill(testTitle)
    await page.getByPlaceholder('Additional details... (optional)').fill(testContent)
    await page.getByRole('button', { name: 'Create Note' }).click()

    const note = page.locator('[data-slot="sticky-note"]', { hasText: testTitle })
    const dropdownTrigger = note.locator('button', { has: page.locator('svg.tabler-icon-dots') })

    // READ
    await expect(note).toBeVisible()
    await expect(note).toContainText(testContent)

    // UPDATE (Color)
    await dropdownTrigger.click()
    await page.getByRole('menuitem', { name: 'Color' }).hover()
    await page.getByRole('menuitem', { name: 'Blue' }).click()
    await expect(note).toHaveAttribute('style', /color: rgb\(13, 43, 62\)/iu, { timeout: 5000 })

    // DELETE
    await page.keyboard.press('Escape')
    await expect(note).toBeVisible()
    await dropdownTrigger.click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await expect(page.getByRole('alertdialog')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(note).not.toBeVisible()
  })
})
