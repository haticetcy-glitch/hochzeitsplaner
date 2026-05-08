import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen · Confetti House',
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

export default function AgbPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-playfair text-4xl text-anthrazit mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-gray-400 font-cormorant text-lg mb-12">Zuletzt aktualisiert: Mai 2026</p>

        <Section title="1. Geltungsbereich">
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Confetti House, betrieben unter confettihouse.de. Mit der Nutzung der Plattform erklären Sie sich mit diesen AGB einverstanden.
          </p>
          <p>
            Confetti House ist ein kostenloses Marktplatzverzeichnis, das Eventdienstleister (Fotografen, Locations, Caterer u. a.) mit Paaren und Eventplanenden verbindet.
          </p>
        </Section>

        <Section title="2. Leistungen von Confetti House">
          <p>Confetti House stellt folgende Leistungen bereit:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Eine kostenlose Suchplattform für Event- und Hochzeitsdienstleister in Deutschland</li>
            <li>Kostenlose Anbieterprofile für Dienstleister</li>
            <li>Ein Kontaktformular zur Weiterleitung von Anfragen an Dienstleister</li>
          </ul>
          <p>
            Confetti House ist lediglich Vermittler und wird nicht selbst Vertragspartei der zwischen Anbietern und Nutzenden geschlossenen Verträge. Wir übernehmen keine Garantie für das Zustandekommen einer Buchung oder Zusammenarbeit.
          </p>
        </Section>

        <Section title="3. Registrierung und Nutzerkonto">
          <p>
            Dienstleister können sich kostenlos registrieren und ein Profil erstellen. Die Registrierung ist nur für Unternehmen oder selbstständige Personen im Eventbereich vorgesehen.
          </p>
          <p>
            Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. Sie sind für die Sicherheit Ihrer Zugangsdaten selbst verantwortlich.
          </p>
          <p>
            Confetti House behält sich das Recht vor, Konten zu sperren oder zu löschen, die gegen diese AGB verstoßen oder falsche Angaben enthalten.
          </p>
        </Section>

        <Section title="4. Pflichten der Dienstleister">
          <p>Dienstleister, die ein Profil erstellen, verpflichten sich:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Nur wahrheitsgemäße, aktuelle und vollständige Informationen zu veröffentlichen</li>
            <li>Keine rechtswidrigen, irreführenden oder anstößigen Inhalte zu veröffentlichen</li>
            <li>Ausschließlich Bilder hochzuladen, an denen sie die entsprechenden Nutzungsrechte besitzen</li>
            <li>Anfragen von Interessierten zeitnah und professionell zu beantworten</li>
            <li>Alle geltenden gesetzlichen Vorschriften (u. a. Impressumspflicht, Preisangaben) einzuhalten</li>
          </ul>
          <p>
            Dienstleister sind für die Inhalte ihrer Profile selbst verantwortlich. Confetti House haftet nicht für die Richtigkeit von Profilinformationen.
          </p>
        </Section>

        <Section title="5. Nutzung durch Paare und Eventplanende">
          <p>
            Die Suche nach Dienstleistern und das Versenden von Kontaktanfragen ist für alle Nutzenden kostenlos und ohne Registrierung möglich.
          </p>
          <p>
            Kontaktanfragen werden direkt an den jeweiligen Dienstleister weitergeleitet. Confetti House ist nicht für die Kommunikation nach der Weiterleitung verantwortlich.
          </p>
        </Section>

        <Section title="6. Kostenfreiheit und zukünftige Premium-Funktionen">
          <p>
            Die Nutzung von Confetti House ist derzeit für alle Beteiligten kostenlos.
          </p>
          <p>
            Confetti House plant zukünftig optionale kostenpflichtige Premium-Funktionen für Dienstleister (z. B. hervorgehobene Platzierung, erweiterte Profiloptionen). Diese werden separat kommuniziert und erfordern eine ausdrückliche Zustimmung. Die Basisnutzung bleibt davon unberührt.
          </p>
        </Section>

        <Section title="7. Haftungsausschluss">
          <p>
            Confetti House übernimmt keine Haftung für:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Die Qualität, Verfügbarkeit oder Zuverlässigkeit der auf der Plattform gelisteten Dienstleister</li>
            <li>Schäden, die aus einer Zusammenarbeit zwischen Nutzenden und Dienstleistern entstehen</li>
            <li>Technische Ausfälle oder Unterbrechungen des Dienstes</li>
            <li>Inhalte auf verlinkten externen Websites</li>
          </ul>
          <p>
            Die Haftung für grobe Fahrlässigkeit und Vorsatz bleibt unberührt.
          </p>
        </Section>

        <Section title="8. Urheberrecht">
          <p>
            Alle Inhalte der Plattform (Texte, Design, Code) sind urheberrechtlich geschützt und dürfen ohne ausdrückliche Genehmigung nicht vervielfältigt oder weiterverwendet werden.
          </p>
          <p>
            Dienstleister räumen Confetti House mit dem Hochladen von Inhalten ein einfaches, nicht übertragbares Nutzungsrecht zur Anzeige auf der Plattform ein.
          </p>
        </Section>

        <Section title="9. Änderungen der AGB">
          <p>
            Confetti House behält sich vor, diese AGB jederzeit zu ändern. Registrierte Dienstleister werden über wesentliche Änderungen per E-Mail informiert. Die weitere Nutzung der Plattform nach Inkrafttreten neuer AGB gilt als Zustimmung.
          </p>
        </Section>

        <Section title="10. Anwendbares Recht und Gerichtsstand">
          <p>
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, soweit gesetzlich zulässig, Deutschland.
          </p>
        </Section>

        <Section title="11. Kontakt">
          <p>
            Bei Fragen zu diesen AGB wenden Sie sich an:
          </p>
          <p>
            <a href="mailto:info@confettihouse.de" className="text-terrakotta hover:underline">
              info@confettihouse.de
            </a>
          </p>
        </Section>
      </div>

      <Footer />
    </>
  )
}
