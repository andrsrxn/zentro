import { COMPANY } from '@zentro/constants/company'
import { formatDate } from '@zentro/utils/dates'

export const metadata = {
  title: 'Terms and Conditions',
  description: `Terms and Conditions for ${COMPANY.name}`,
}

export default function TermsPage() {
  return (
    <section className='bg-dotted w-full'>
      <article className='prose prose-neutral animate-in fade-in dark:prose-invert container mx-auto block max-w-4xl px-4 py-16 duration-500 ease-in-out sm:px-6 lg:px-8'>
        <h1>Terms and Conditions</h1>
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
          Welcome to {COMPANY.name}. Please note that {COMPANY.name} is not a registered company,
          brand, or commercial entity. It is a full-stack project demo created for the portfolio of
          Carlos Andrés Raxón Castañeda (operating under the commercial freelancer name "andrsrxn",
          accessible at{' '}
          <a
            href='https://andrsrxn.com'
            className='hover:text-primary decoration-1 underline-offset-1'
            target='_blank'
            rel='noopener noreferrer'>
            andrsrxn.com
          </a>
          ).
        </p>
        <p>
          By accessing and using this web application, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and Conditions. If you do not agree,
          please do not use the application.
        </p>

        <h2>2. Purpose of the Application</h2>
        <p>
          {COMPANY.name} is provided solely for demonstration and educational purposes to showcase
          technical skills and software development capabilities. It is not intended for production
          use, and we do not guarantee the permanent availability, reliability, or security of the
          services provided.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          To access certain features, you may authenticate using third-party OAuth providers (such
          as Google or GitHub). You are responsible for maintaining the confidentiality of your
          account credentials. Because this is a portfolio demo, we reserve the right to delete
          accounts, wipe databases, or terminate the service at any time without prior notice.
        </p>

        <h2>4. User Content</h2>
        <p>
          Users may create and store "notes" (including titles, content, colors, and layout
          positions). You retain ownership of the data you input. However, you agree not to submit
          sensitive, confidential, or illegal information. We are not responsible for any loss of
          data, as the application's database may be reset periodically.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          The application is provided on an "AS IS" and "AS AVAILABLE" basis. Carlos Andrés Raxón
          Castañeda shall not be held liable for any direct, indirect, incidental, or consequential
          damages resulting from the use or inability to use this demonstration project.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws
          of Guatemala. Any disputes relating to these terms shall be subject to the exclusive
          jurisdiction of the courts of Guatemala.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact me through my portfolio at{' '}
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
