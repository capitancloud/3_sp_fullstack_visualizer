import { motion } from 'framer-motion';
import { 
  Info, CheckCircle, AlertTriangle, Lightbulb,
  ArrowRight, Clock, Shield, Database, Zap
} from 'lucide-react';
import { Simulation } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface SimulationInfoProps {
  simulation: Simulation;
}

// Detailed info for each simulation
const simulationDetails: Record<string, {
  summary: string;
  keyPoints: string[];
  learnPoints: string[];
  difficulty: 'facile' | 'medio' | 'avanzato';
  estimatedTime: string;
}> = {
  // Base
  login: {
    summary: 'Il processo di login verifica l\'identità dell\'utente e crea una sessione sicura tramite token JWT.',
    keyPoints: [
      'Le credenziali vengono inviate in modo sicuro (HTTPS)',
      'Il backend verifica la password hashata nel database',
      'Un token JWT viene generato per le richieste successive',
      'Il token viene salvato nel browser (localStorage/cookie)',
    ],
    learnPoints: [
      'Come funziona l\'autenticazione stateless',
      'Perché si usano i token invece delle sessioni',
      'L\'importanza di non salvare password in chiaro',
    ],
    difficulty: 'facile',
    estimatedTime: '8 step',
  },
  register: {
    summary: 'La registrazione crea un nuovo account utente con validazione dei dati e invio di email di conferma.',
    keyPoints: [
      'I dati vengono validati lato frontend E backend',
      'La password viene hashata prima del salvataggio',
      'Viene generato un ID univoco per l\'utente',
      'Un\'email di benvenuto conferma la registrazione',
    ],
    learnPoints: [
      'La validazione deve avvenire su entrambi i lati',
      'Come proteggere le password con l\'hashing',
      'L\'importanza delle email transazionali',
    ],
    difficulty: 'facile',
    estimatedTime: '8 step',
  },
  'load-data': {
    summary: 'Il caricamento dati mostra come una pagina recupera informazioni dal server in modo autenticato.',
    keyPoints: [
      'Il token viene inviato nell\'header Authorization',
      'Il backend verifica il token prima di rispondere',
      'I dati vengono formattati prima dell\'invio',
      'Il frontend renderizza i dati ricevuti',
    ],
    learnPoints: [
      'Come proteggere le API con autenticazione',
      'Il ciclo richiesta-risposta HTTP',
      'Separazione tra dati e presentazione',
    ],
    difficulty: 'facile',
    estimatedTime: '8 step',
  },
  
  // CRUD
  'update-profile': {
    summary: 'L\'aggiornamento profilo modifica i dati utente esistenti con verifica dei permessi.',
    keyPoints: [
      'Solo l\'utente autenticato può modificare i propri dati',
      'Il metodo HTTP PUT indica un aggiornamento',
      'Il database esegue UPDATE invece di INSERT',
      'Feedback immediato conferma il salvataggio',
    ],
    learnPoints: [
      'Differenza tra POST, PUT e PATCH',
      'Come implementare l\'autorizzazione',
      'Pattern di feedback UX per operazioni CRUD',
    ],
    difficulty: 'medio',
    estimatedTime: '8 step',
  },
  'delete-account': {
    summary: 'L\'eliminazione account è un\'operazione critica che richiede conferme multiple e cleanup dei dati.',
    keyPoints: [
      'Richiede conferma esplicita dell\'identità',
      'I dati correlati devono essere eliminati (cascade)',
      'Un\'email conferma l\'avvenuta eliminazione',
      'La sessione viene terminata automaticamente',
    ],
    learnPoints: [
      'Perché le operazioni distruttive richiedono conferme',
      'Gestione delle relazioni tra tabelle (foreign keys)',
      'GDPR e diritto alla cancellazione dei dati',
    ],
    difficulty: 'avanzato',
    estimatedTime: '10 step',
  },
  'search-filter': {
    summary: 'La ricerca con filtri combina query database e cache per performance ottimali.',
    keyPoints: [
      'I parametri di ricerca sono nella query string',
      'La cache evita query ripetute al database',
      'Cache miss = query al DB + salvataggio in cache',
      'TTL (Time To Live) gestisce la scadenza cache',
    ],
    learnPoints: [
      'Come ottimizzare le performance con la cache',
      'Pattern cache-aside (lazy loading)',
      'Importanza degli indici database per le ricerche',
    ],
    difficulty: 'avanzato',
    estimatedTime: '10 step',
  },
  
  // Errors
  'error-401': {
    summary: 'L\'errore 401 si verifica quando l\'autenticazione fallisce o il token è scaduto.',
    keyPoints: [
      'Il token può scadere per sicurezza',
      'Il backend rifiuta richieste non autenticate',
      'Il frontend deve gestire il redirect al login',
      'I dati sensibili non vengono mai esposti',
    ],
    learnPoints: [
      'Differenza tra 401 (non autenticato) e 403 (non autorizzato)',
      'Perché i token hanno una scadenza',
      'Come implementare il refresh token',
    ],
    difficulty: 'medio',
    estimatedTime: '6 step',
  },
  'error-404': {
    summary: 'L\'errore 404 indica che la risorsa richiesta non esiste nel sistema.',
    keyPoints: [
      'La risorsa potrebbe essere stata eliminata',
      'L\'ID richiesto non esiste nel database',
      'Il frontend mostra una pagina di errore user-friendly',
      'I log aiutano a identificare link rotti',
    ],
    learnPoints: [
      'Come gestire risorse mancanti gracefully',
      'L\'importanza di pagine 404 personalizzate',
      'Soft delete vs hard delete',
    ],
    difficulty: 'facile',
    estimatedTime: '6 step',
  },
  'error-500': {
    summary: 'L\'errore 500 è un errore interno del server che non deve esporre dettagli all\'utente.',
    keyPoints: [
      'L\'errore originale viene loggato internamente',
      'L\'utente vede solo un messaggio generico',
      'Il sistema di monitoring viene allertato',
      'Il frontend offre opzioni di retry',
    ],
    learnPoints: [
      'Perché non esporre stack trace agli utenti',
      'L\'importanza del logging e monitoring',
      'Pattern di error handling centralizzato',
    ],
    difficulty: 'medio',
    estimatedTime: '6 step',
  },
  'error-timeout': {
    summary: 'Il timeout si verifica quando un\'operazione supera il tempo massimo consentito.',
    keyPoints: [
      'Query complesse possono superare i limiti',
      'Il timeout protegge le risorse del server',
      'L\'utente deve avere opzione di riprovare',
      'Background jobs per operazioni lunghe',
    ],
    learnPoints: [
      'Come ottimizzare query lente',
      'Pattern async per operazioni lunghe',
      'Importanza dei timeout per la resilienza',
    ],
    difficulty: 'avanzato',
    estimatedTime: '6 step',
  },
  
  // Payments
  'payment-flow': {
    summary: 'Il flusso di pagamento gestisce transazioni finanziarie in modo sicuro tramite gateway esterni.',
    keyPoints: [
      'I dati della carta non toccano mai il tuo server',
      'Il Payment Intent separa autorizzazione da cattura',
      'L\'ordine passa da pending a paid atomicamente',
      'Email di conferma e ricevuta sono obbligatorie',
    ],
    learnPoints: [
      'Perché usare gateway come Stripe (PCI compliance)',
      'Il pattern Payment Intent per pagamenti sicuri',
      'Gestione degli stati degli ordini',
    ],
    difficulty: 'avanzato',
    estimatedTime: '18 step',
  },
  
  // Files
  'file-upload': {
    summary: 'L\'upload di file trasferisce contenuti binari su storage cloud separato dal database.',
    keyPoints: [
      'I file vanno su storage dedicato, non nel DB',
      'I permessi vengono verificati prima dell\'upload',
      'L\'URL pubblico viene salvato nel database',
      'CDN distribuisce i file globalmente',
    ],
    learnPoints: [
      'Perché separare storage file dal database',
      'Come gestire permessi e quote utente',
      'L\'importanza del CDN per le performance',
    ],
    difficulty: 'medio',
    estimatedTime: '10 step',
  },
  
  // Auth
  'reset-password': {
    summary: 'Il reset password permette di recuperare l\'accesso in modo sicuro tramite email.',
    keyPoints: [
      'Il token di reset ha scadenza breve (1 ora)',
      'Non rivelare se l\'email esiste nel sistema',
      'Il vecchio token viene invalidato all\'uso',
      'La nuova password deve essere hashata',
    ],
    learnPoints: [
      'Security through obscurity per le email',
      'Perché i token di reset scadono velocemente',
      'Come invalidare token usati (one-time use)',
    ],
    difficulty: 'medio',
    estimatedTime: '12 step',
  },
  
  // Performance
  'cache-flow': {
    summary: 'La cache Redis accelera drasticamente le risposte memorizzando dati frequenti in RAM.',
    keyPoints: [
      'Cache hit = risposta in millisecondi',
      'La RAM è 100x più veloce del disco',
      'TTL previene dati stantii',
      'Cache warming per dati critici',
    ],
    learnPoints: [
      'Quando usare (e quando non usare) la cache',
      'Pattern cache-aside vs write-through',
      'Come gestire l\'invalidazione della cache',
    ],
    difficulty: 'avanzato',
    estimatedTime: '6 step',
  },
  
  // Real-time
  'realtime-notification': {
    summary: 'Le notifiche real-time usano WebSocket per push istantaneo dal server al client.',
    keyPoints: [
      'WebSocket mantiene connessione persistente',
      'Il server può inviare dati senza richiesta',
      'I canali separano diversi tipi di eventi',
      'Reconnection automatica in caso di disconnessione',
    ],
    learnPoints: [
      'Differenza tra polling e WebSocket',
      'Quando usare HTTP vs WebSocket',
      'Pattern pub/sub per notifiche',
    ],
    difficulty: 'avanzato',
    estimatedTime: '8 step',
  },
  'realtime-chat': {
    summary: 'La chat real-time combina WebSocket per la velocità e database per la persistenza.',
    keyPoints: [
      'I messaggi sono inviati via WebSocket',
      'Il backend salva ogni messaggio nel DB',
      'Broadcast invia a tutti nella stanza',
      'La storia chat viene caricata via HTTP',
    ],
    learnPoints: [
      'Come combinare real-time e persistenza',
      'Pattern room/channel per chat di gruppo',
      'Gestione presenza utenti online',
    ],
    difficulty: 'avanzato',
    estimatedTime: '8 step',
  },
};

const difficultyConfig = {
  facile: { color: 'text-green-500 bg-green-500/10', label: 'Facile' },
  medio: { color: 'text-yellow-500 bg-yellow-500/10', label: 'Medio' },
  avanzato: { color: 'text-orange-500 bg-orange-500/10', label: 'Avanzato' },
};

export function SimulationInfo({ simulation }: SimulationInfoProps) {
  const details = simulationDetails[simulation.id];
  
  if (!details) {
    return null;
  }

  const difficulty = difficultyConfig[details.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Informazioni</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', difficulty.color)}>
            {difficulty.label}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {details.estimatedTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {details.summary}
        </p>

        {/* Key Points */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Punti Chiave
            </span>
          </div>
          <ul className="space-y-1.5">
            {details.keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-xs text-foreground/80"
              >
                <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* What You'll Learn */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Cosa Imparerai
            </span>
          </div>
          <ul className="space-y-1.5">
            {details.learnPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2 text-xs text-foreground/80"
              >
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
