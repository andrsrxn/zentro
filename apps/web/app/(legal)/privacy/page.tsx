import { COMPANY } from '@zentro/constants/company'
import { formatDate } from '@zentro/utils/dates'

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${COMPANY.name}`,
}

export default function PrivacyPage() {
  return (
    <section className='bg-dotted w-full'>
      <article className='prose prose-neutral animate-in fade-in dark:prose-invert container mx-auto block max-w-4xl px-4 py-16 duration-500 ease-in-out sm:px-6 lg:px-8'>
        <h1>Privacy Policy</h1>
        <p>
          <strong>Last Updated:</strong>{' '}
          {formatDate({
            date: new Date('2026-05-22'),
            includeWeekDay: true,
            timeZone: 'America/Guatemala',
          })}
        </p>

        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy explains how information is collected, used, and handled when you use{' '}
          {COMPANY.name}. {COMPANY.name} is not a commercial product or registered company; it is a
          full-stack portfolio demonstration project created by Carlos Andrés Raxón Castañeda
          (portfolio at{' '}
          <a
            href='https://andrsrxn.com'
            className='hover:text-primary decoration-1 underline-offset-1'
            target='_blank'
            rel='noopener noreferrer'>
            andrsrxn.com
          </a>
          ), based in Guatemala.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          When you use our application, we may collect and store the following information in our
          database:
        </p>
        <ul>
          <li>
            <strong>Profile Information:</strong> Your full name, email address, email verification
            status, and profile image provided by the OAuth provider.
          </li>
          <li>
            <strong>Account Data:</strong> Account IDs, provider IDs, and OAuth tokens to manage
            authentication. We request only the default scopes from Google and GitHub.
          </li>
          <li>
            <strong>Session Information:</strong> Session tokens, expiration dates, IP addresses,
            and User-Agent strings for security and session management.
          </li>
          <li>
            <strong>Preferences & Settings:</strong> Your country code and timezone.
          </li>
          <li>
            <strong>User-Generated Content:</strong> The notes you create, including titles, text
            content and color choices.
          </li>
        </ul>

        <h2>3. Use of Cookies</h2>
        <p>
          We use our own strictly necessary cookies to maintain your session and keep you logged in.
          We also use cookies set by our OAuth providers (Google and GitHub) to facilitate the
          authentication process. We do not use third-party tracking, advertising, or analytics
          cookies.
        </p>

        <h2>4. How We Use Your Information</h2>
        <p>
          The information collected is used exclusively to demonstrate the technical capabilities of
          this application (e.g., authentication flows, CRUD operations, session management). We do
          not sell, rent, or share your personal data with third parties for marketing or any other
          commercial purposes.
        </p>

        <h2>5. Data Retention and Deletion</h2>
        <p>
          As this is a portfolio demo project, the database may be completely wiped at any given
          time without notice. If you wish to have your data removed immediately, you may delete
          your account from the application settings, which will automatically delete all your
          associated information.
        </p>

        <h2>6. Security</h2>
        <p>
          While we implement standard security measures and best practices, please remember that
          this is a demonstration project. We strongly advise against storing sensitive, personal,
          or confidential information in this application.
        </p>

        <h2>7. Contact</h2>
        <p>
          For any questions or concerns regarding this Privacy Policy or your data, you can reach
          out via my portfolio at{' '}
          <a
            href='https://andrsrxn.com'
            className='hover:text-primary decoration-1 underline-offset-1'
            target='_blank'
            rel='noopener noreferrer'>
            andrsrxn.com
          </a>
          .
        </p>
      </article>
    </section>
  )
}
