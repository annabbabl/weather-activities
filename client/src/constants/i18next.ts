import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
        en: {
            translation: {

              //common
              save: "Save", 
              agree: "Agree",


              //constants
              climateChange: "Climate Change", 
              socialIssues: "Social Issues", 
              rent: "Rent", 
              infrastructure: "Infrastructure", 
              migration: "Migration", 
              foreignPolicy: "Foreign Policy", 
              school: "School", 
              monetary: "Monetary", 
              taxes: "Taxes", 
              bubatz: "Bubatz", 
              doenerPreisBremse: "Doenerpreismbremse", 

              //menubar
              homepage: "Homepage", 
              frequentQuestions: "Frequent Questions",
              election:"Election", 
              analytics: "Analytics",


              //homepage
              electYourFuture: "Elect Your Future", 
              coreInformation:"Core Information",
              electionDate: "Date", 
              where:"Where?", 
              online:"Online", 
              candidates: "Candidates", 
              electionText: "The upcoming election introduces an innovative concept that fundamentally differs from traditional voting processes. In this election, the focus is not on electing individual candidates, but on voting for specific theses, also known as election propositions, presented by the candidates. These theses address essential topics and political measures crucial for the future direction of policy-making", 
              howDoesTheElectionWorkHeader:"How does the election work?",
              howDoesTheElectionWork:"Instead of voting for a person, voters have the opportunity to cast their votes for individual theses proposed by the candidates. Each candidate presents a set of theses that reflect their political visions and priorities. The goal is to enable direct and topic-focused decision-making, allowing voters to express their support or disapproval for specific political measures.", 
              electionProcedureHeader: "Procedure", 
              electionProcedure1: "-  Candidates and Their Theses: Before the election, each candidate presents a bundle of theses that are put forward as election propositions. These theses cover a wide range of topics, such as environmental policy, social justice, economic reforms, and education.", 
              electionProcedure2: "-  Voting: On election day, voters can cast their votes for the theses they wish to support. It is possible to vote for multiple theses from different candidates, allowing for a nuanced and topic-specific voting decision.", 
              electionProcedure3: "-  Counting and Results: After the votes are cast, the votes for each thesis are counted. The candidate whose theses receive the most votes will be declared the winner of the election. This system ensures that the candidate whose political proposals receive the broadest support from the public wins.", 
              electionAdvantagesHeader: "Advantages", 
              electionAdvantages1: "-  Thematic Clarity: Voters can specifically vote on concrete political measures, allowing a clear statement of their preferences and priorities.",
              electionAdvantages2: "-  Direct Democracy: The thesis election promotes direct citizen participation in crucial political decisions and can increase transparency and accountability in politics.", 
              electionAdvantages3: "-  Diversity of Opinions: As voters can cast their votes for various theses from different candidates, a broader range of opinions and approaches is considered.", 
              loginOrRegister:"Login or Register", 
              participationAlert: "Start Now!", 
              startNow: "Start", 
              election2024: "Election 2024",


              //not Found
              noFound: "Not Found", 
              sorryNotFound: "Sorry Not Found", 
              pleaseGo: "Please Go", 

              //Login
              signIn: "Sign In", 
              haveNoAccount: "You do not have an account?", 
              haveAccount: "You have an account?", 
              email: "Email", 
              password: "Password", 
              register: "Register Now",
              username: "Username",

              //candidate register
              candidateInfo: "Add Candidate Information",
              degree: "Degree", 
              life:"Life", 
              thesis: "Thesis", 
              theses: "Theses", 
              opinion: "Opinion", 
              addThesis: "Add a Thesis",
              saveTheses: "Save Theses",
              tags: "Tags", 
              uploadProfilePicture: "Upload Profile Picture",
              description: "Description",
              revertTag: "Revert Tag Selection",

              //good luck 
              goodLuck: "Good Luck",
              goAhead: "Go Ahead", 
              
              //candidates
              wannaKnowMore:"You wanna know more about ", 
              erfahren: "", 
              aboutText: "About: ",
              live: "Live: ",
              candidateFoto: "Candidate Foto", 
              candidatesText: "In the upcoming election, the main candidates are: ",
              youAlreadyVoted: "You have already voted. Thank you for Your Contribution!",


              //election

              //start electionVoters re
              howDoesTheElectionWostartElectionHeader: "How Does The Election Work?", 
              howDoesTheElectionWostartElectionText: "Voters receive a confirmation message that their vote has been successfully cast. After the voting period ends, votes are securely counted using encrypted methods to ensure accuracy and confidentiality.The results are announced once the counting is complete and verified.",
              rule1: "1. Ensure you have a valid ID to verify your identity.",
              rule2: "2. You must be registered in the electoral roll to participate.",
              rule3: "3. Follow the instructions provided by the election officers.",
              beforeYoustartText: "Before You Start",

              //process
              submitVotes: "Submit Vote",
              selectRound: "Select Round", 

              //finish
              thankForYourVote: "Thank ypu for Your vote!",
              votingIsOver: "Voting Is Over! See who the winner is!",

              //analytics
              participants: "Participants", 
              peopleVoted: "People Voted", 
              timeIsUp: "Time Is Up", 
              theElectionHasNotYetEnded: "The Election Has Not Yet Ended", 
              timeLeft:"Time Left", 
              peopleHaveRegisteredAndNotVoted: "People registered, but not voted", 
              votingPerc: "Voting % ",

            }
        }, 
        de: {
            translation: {
              //common
              save: "Speichern",
              agree: "Einverstanden",

              //constants
              climateChange: "Klimawandel",
              socialIssues: "Soziale Probleme",
              rent: "Miete",
              infrastructure: "Infrastruktur",
              migration: "Migration",
              foreignPolicy: "Außenpolitik",
              school: "Schule",
              monetary: "Geldpolitik",
              taxes: "Steuern",
              bubatz: "Bubatz",
              doenerPreisBremse: "Dönerpreis-Bremse",
              election2024: "Wahl 2024",


                //menubar
              homepage: "Homepage", 
              frequentQuestions: "Häufige Fragen",
              election:"Wahl", 
              analytics: "Analyse",

              //homepage
              electYourFuture: "Wähle deine Zukunft", 
              electionText: "In der bevorstehenden Wahl steht ein innovatives Konzept im Mittelpunkt, das sich grundlegend von herkömmlichen Wahlverfahren unterscheidet. Bei dieser Wahl wird nicht über einzelne Kandidaten abgestimmt, sondern über spezifische Thesen, auch Wahlpropositionen genannt, die von den Kandidaten präsentiert werden. Diese Thesen behandeln wesentliche Themen und politischen Maßnahmen, die für die zukünftige Ausrichtung von zentraler Bedeutung sind.", 
              
              coreInformation:"Wichtigste Informationen",
              electionDate: "Datum", 
              where:"Wo?", 
              online:"Online", 
              candidates: "Kandidaten", 

              howDoesTheElectionWorkHeader:"Wie funktioniert die Wahl?",
              electionProcedureHeader:"Ablauf", 
              howDoesTheElectionWork:"Statt wie üblich für eine Person zu stimmen, haben die Wählerinnen und Wähler die Möglichkeit, ihre Stimme für einzelne Thesen abzugeben, die von den Kandidaten vorgeschlagen wurden. Jeder Kandidat tritt mit einem Set von Thesen an, die seine politischen Visionen und Prioritäten widerspiegeln. Ziel ist es, eine direkte und themenbezogene Entscheidungsfindung zu ermöglichen, bei der die Wählerinnen und Wähler ihre Zustimmung oder Ablehnung zu spezifischen politischen Maßnahmen ausdrücken können.",
              electionProcedure1: "1.Kandidaten und ihre Thesen: Jeder Kandidat stellt vor der Wahl ein Bündel an Thesen vor, die in Form von Wahlpropositionen zur Abstimmung stehen. Diese Thesen decken eine breite Palette von Themen ab, wie z.B. Umweltpolitik, soziale Gerechtigkeit, wirtschaftliche Reformen und Bildung.", 
              electionProcedure2: "2.Stimmabgabe: Am Wahltag können die Wählerinnen und Wähler die These online auswählen, die sie unterstützen möchten. Es ist möglich, für mehrere Thesen unterschiedlicher Kandidaten zu stimmen, wodurch eine differenzierte und themenbezogene Wahlentscheidung getroffen werden kann.", 
              electionProcedure3: " 3.Auszählung und Ergebnis: Nach der Stimmabgabe werden die Stimmen pro These ausgezählt. Der Kandidat, dessen Thesen die meisten Stimmen erhalten, wird als Sieger der Wahl hervorgehen. Dieses System stellt sicher, dass derjenige Kandidat gewinnt, dessen politische Vorschläge die größte Zustimmung in der Bevölkerung finden.", 
              electionAdvantagesHeader: "Vorteile", 
              electionAdvantages1: "Thematische Klarheit: Die Wählerinnen und Wähler können gezielt über konkrete politische Maßnahmen abstimmen, was eine klare Aussage über ihre Präferenzen und Prioritäten ermöglicht.",
              electionAdvantages2: "Direkte Demokratie: Die Thesenwahl fördert eine direkte Mitbestimmung der Bürgerinnen und Bürger an wichtigen politischen Entscheidungen und kann die Transparenz und Verantwortlichkeit in der Politik erhöhen.", 
              electionAdvantages3: "Vielfalt der Meinungen: Da die Wählerinnen und Wähler ihre Stimme für verschiedene Thesen unterschiedlicher Kandidaten abgeben können, wird eine breitere Palette von Meinungen und Ansätzen berücksichtigt.", 
              loginOrRegister:"Registrieren oder Einloggen", 
              participationAlert: "Wähle jetzt!", 
              startNow: "Starte Jetzt", 

              //not Found
              noFound: "Nicht gefunden", 
              sorryNotFound: "Entschuldigen Sie bitte. Wir haben die Seite nicht gefunden.", 
              pleaseGo: "Bitte gehen Sie zut", 

              //Login
              signIn: "Registriered dich", 
              haveNoAccount: "Du hast noch keinen Account?", 
              haveAccount: "Du hast einen Account?", 
              email: "Email", 
              password: "Passwort", 
              register: "Register Now", 
              username: "Benutzername",

              //candidate register
              candidateInfo: "Gene Informationen zum Kandidaten ein",
              degree: "Lehre", 
              life:"Lebenslauf", 
              thesis: "These", 
              theses: "Thesen", 
              opinion: "Glaube", 
              addThesis: "Füge eine These hinzu",
              saveTheses: "Sichere die Thesen",
              tags: "Tags",
              uploadProfilePicture: "Profilbild hochladen",
              description: "Beschreibung",
              revertTag: "Revert Tag Selection",
            
              //good luck 
              goodLuck: "Viel Erfolg!",
              goAhead: "Mach weiter", 

              //candidates
              wannaKnowMore:"Du willst mehr über ", 
              erfahren: " erfahren", 
              aboutText: "Über: ",
              live: "Leben: ", 
              candidateFoto: "Foto des Kandidaten", 
              candidatesText: "Bei der bevorstehenden Wahl bewerben sich: ",

              //election

              //start election
              howDoesTheElectionWostartElectionHeader: "Wie funktioniert die Wahl?", 
              howDoesTheElectionWostartElectionText: "Die Wähler erhalten einen elektronischen Stimmzettel, auf dem sie ihre bevorzugten Kandidaten oder Optionen auswählen können. Nachdem die Auswahl getroffen wurde, wird der Stimmzettel über das System eingereicht.\n4. **Bestätigung:** Die Wähler erhalten eine Bestätigungsnachricht, dass ihre Stimme erfolgreich abgegeben wurde.Nach dem Ende der Abstimmungsperiode werden die Stimmen mit verschlüsselten Methoden sicher gezählt, um Genauigkeit und Vertraulichkeit zu gewährleisten.Die Ergebnisse werden bekannt gegeben, sobald die Auszählung abgeschlossen und verifiziert ist.",
              rule1: "1. Stellen Sie sicher, dass Sie einen gültigen Ausweis zur Überprüfung Ihrer Identität haben.",
              rule2: "2. Sie müssen im Wählerverzeichnis eingetragen sein, um teilzunehmen.",
              rule3: "3. Befolgen Sie die Anweisungen der Wahlhelfer.",
              beforeYoustartText: "Bevor du anfägnst",
              youAlreadyVoted: "Du hast bereits gewählt. Vielen Dank für deine Stimme!",


              //process
              submitVotes: "Wähle",
              selectRound: "Wähle Runde", 

              //finish
              thankForYourVote: "Danke für Deine Stimme!",
              votingIsOver: "Die Wahl ist vorbei! Wehe wer der Gewinner ist!",

              //analytics
              participants: "Beteiligte", 
              peopleVoted: "Berits abgestimmt", 
              timeIsUp: "Zeit ist abgelaufen", 
              theElectionHasNotYetEnded: "Die Whal hat noch nicht geendet", 
              timeLeft:"Zeit übrig", 
              peopleHaveRegisteredAndNotVoted: "Registriert, aber nicht abgestimmt", 
              votingPerc: "Wahlergebnise % "
            }
        }
    }
  });
export default i18n;