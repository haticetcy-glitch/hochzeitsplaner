import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung · Confetti House',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-playfair text-xl text-anthrazit mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3 font-cormorant text-[17px]">
        {children}
      </div>
    </section>
  )
}

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-playfair text-4xl text-anthrazit mb-2">Datenschutzerklärung</h1>
        <p className="text-gray-400 font-cormorant text-lg mb-12">Zuletzt aktualisiert: Mai 2026</p>

        <Section title="1. Verantwortlicher">
          <p>
            Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
          </p>
          <p className="bg-white border border-gray-100 rounded-xl p-5 text-sm leading-7">
            Confetti House<br />
            Deutschland<br />
            E-Mail: <a href="mailto:datenschutz@confettihouse.de" className="text-terrakotta hover:underline">datenschutz@confettihouse.de</a>
          </p>
        </Section>

        <Section title="2. Welche Daten wir erheben">
          <p>
            Wir erheben nur die Daten, die für den Betrieb der Plattform notwendig sind:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Registrierungsdaten</strong> (Dienstleister): Name, E-Mail-Adresse, Passwort (verschlüsselt), Unternehmensdaten, Profilbilder</li>
            <li><strong>Kontaktanfragen</strong> (Paare & Planende): Name, E-Mail-Adresse, Telefonnummer (optional), Veranstaltungsdatum, Nachricht</li>
            <li><strong>Nutzungsdaten</strong>: IP-Adresse, Browsertyp, besuchte Seiten – ausschließlich zur technischen Bereitstellung des Dienstes</li>
            <li><strong>Google-Anmeldedaten</strong>: Wenn Sie sich per Google anmelden, erhalten wir Ihren Namen und Ihre E-Mail-Adresse von Google</li>
          </ul>
        </Section>

        <Section title="3. Zweck der Datenverarbeitung">
          <p>Ihre Daten werden ausschließlich zu folgenden Zwecken verarbeitet:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Bereitstellung und Betrieb der Confetti House Plattform</li>
            <li>Weitergabe von Kontaktanfragen an den jeweiligen Dienstleister</li>
            <li>Versand von transaktionalen E-Mails (z. B. Anfragebestätigungen)</li>
            <li>Verbesserung unserer Dienste</li>
          </ul>
          <p>Wir verkaufen Ihre Daten nicht und geben sie nicht zu Werbezwecken an Dritte weiter.</p>
        </Section>

        <Section title="4. Rechtsgrundlagen">
          <p>
            Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung (Nutzung der Plattform)</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigte Interessen (technischer Betrieb, Sicherheit)</li>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung (soweit Sie aktiv zustimmen)</li>
          </ul>
        </Section>

        <Section title="5. Drittanbieter">
          <p>Wir setzen folgende externe Dienste ein:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Supabase</strong> (Supabase Inc., USA) – Datenbank und Authentifizierung.
              Daten werden in der EU-Region gespeichert. Datenschutzinformationen: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-terrakotta hover:underline">supabase.com/privacy</a>
            </li>
            <li>
              <strong>Vercel</strong> (Vercel Inc., USA) – Hosting der Webanwendung.
              Datenschutzinformationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-terrakotta hover:underline">vercel.com/legal/privacy-policy</a>
            </li>
            <li>
              <strong>Resend</strong> (Resend Inc., USA) – Versand von transaktionalen E-Mails.
              Datenschutzinformationen: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-terrakotta hover:underline">resend.com/legal/privacy-policy</a>
            </li>
            <li>
              <strong>Google OAuth</strong> (Google LLC, USA) – Optionale Anmeldung über Google.
              Datenschutzinformationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-terrakotta hover:underline">policies.google.com/privacy</a>
            </li>
          </ul>
          <p>
            Alle genannten Anbieter sind entweder nach dem EU-US Data Privacy Framework zertifiziert oder wir haben mit ihnen Standardvertragsklauseln abgeschlossen.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Confetti House verwendet ausschließlich technisch notwendige Cookies für die Sitzungsverwaltung (Login-Status). Es werden keine Tracking- oder Marketing-Cookies gesetzt.
          </p>
          <p>
            Sie können Cookies in Ihrem Browser deaktivieren, jedoch kann dies die Funktionalität der Plattform einschränken.
          </p>
        </Section>

        <Section title="7. Speicherdauer">
          <p>
            Wir speichern Ihre Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Kontoanfragen</strong>: bis zur Löschung des Kontos</li>
            <li><strong>Kontaktanfragen</strong>: bis zu 12 Monate nach Eingang</li>
            <li><strong>Server-Logs</strong>: maximal 30 Tage</li>
          </ul>
        </Section>

        <Section title="8. Ihre Rechte">
          <p>Sie haben gegenüber uns folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
            <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
            <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
            <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
            <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
            <a href="mailto:datenschutz@confettihouse.de" className="text-terrakotta hover:underline">
              datenschutz@confettihouse.de
            </a>
          </p>
          <p>
            Sie haben zudem das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnsitz in Deutschland.
          </p>
        </Section>

        <Section title="9. Kontakt">
          <p>
            Bei Fragen zum Datenschutz auf unserer Plattform erreichen Sie uns unter:
          </p>
          <p>
            <a href="mailto:datenschutz@confettihouse.de" className="text-terrakotta hover:underline">
              datenschutz@confettihouse.de
            </a>
          </p>
        </Section>
      </div>

      <Footer />
    </>
  )
}
