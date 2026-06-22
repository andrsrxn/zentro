/** biome-ignore-all lint/nursery/useConsistentTestIt: API convention */
import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')
  })

  test('should allow logging in anonymously as a guest', async ({ page }) => {
    // Verify we are on the unauthenticated view
    await expect(page.getByText('Sign in to')).toBeVisible()

    // Click the anonymous login button
    await page.getByRole('button', { name: 'Continue as Guest' }).click()

    // wait before reload
    await page.waitForTimeout(5000)
    await page.reload()
    // Wait for the login process and the page refresh
    // We expect the authenticated view to appear
    await expect(page.locator('header [data-slot="avatar"]')).toBeVisible({ timeout: 10_000 })

    // The showcase notes should no longer be visible, and the real Notes list should be
    await expect(page.getByText('Sign in to')).not.toBeVisible()
  })

  test('should redirect to GitHub OAuth authorization URL', async ({ page }) => {
    // Wait for the button
    const githubBtn = page.getByRole('button', { name: 'Continue with GitHub' })
    await expect(githubBtn).toBeVisible()

    // We can intercept the navigation to verify it attempts to go to github.com
    // or we can wait for the popup/redirect

    // It's safer to intercept to avoid actual navigation and external network flakiness
    await page.route('**/*', route => {
      const url = route.request().url()
      if (url.includes('github.com/login/oauth/authorize')) {
        route.abort('aborted')
      } else {
        route.continue()
      }
    })

    // Listen for the request
    const requestPromise = page.waitForRequest(req =>
      req.url().includes('github.com/login/oauth/authorize')
    )

    await githubBtn.click()

    const request = await requestPromise
    expect(request.url()).toContain('github.com/login/oauth/authorize')
  })

  test('should redirect to Google OAuth authorization URL', async ({ page }) => {
    // Wait for the button
    const googleBtn = page.getByRole('button', { name: 'Continue with Google' })
    await expect(googleBtn).toBeVisible()

    await page.route('**/*', route => {
      const url = route.request().url()
      if (url.includes('accounts.google.com/o/oauth2')) {
        route.abort('aborted')
      } else {
        route.continue()
      }
    })

    // Listen for the request
    const requestPromise = page.waitForRequest(req =>
      req.url().includes('accounts.google.com/o/oauth2/')
    )

    await googleBtn.click()

    const request = await requestPromise
    expect(request.url()).toContain('accounts.google.com/o/oauth2/')
  })
})
