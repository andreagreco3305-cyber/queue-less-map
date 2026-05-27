# Queue Less

Ordina al bar in anticipo e salta la fila — MVP con **Supabase Auth**, **ordini su DB** e **assistente AI**.

## Setup rapido

### 1. Dipendenze

```bash
npm install
```

### 2. Variabili d'ambiente

Copia `.env.local.example` in `.env.local` e compila:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — da Supabase → Settings → API
- `GEMINI_API_KEY` — da [Google AI Studio](https://aistudio.google.com/apikey)
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` in locale

### 3. Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. **SQL Editor** → incolla ed esegui `supabase/schema.sql`
3. **Authentication** → Providers → Email: abilita **Confirm email**
4. **Authentication** → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Logo

Metti il tuo file in `public/logo.png` (consigliato 128×128).  
Se manca, l'app mostra il fallback “QL” indigo.

### 5. Avvio

```bash
npm run dev
```

Apri http://localhost:3000

---

## Funzionalità

| Area | Dettaglio |
|------|-----------|
| **Auth** | Registrazione / login email + password, conferma email Supabase |
| **Bar** | 4 locali Milano, card stile TheFork con foto |
| **Ordini** | Carrello, slot ritiro, salvataggio tabella `orders` |
| **AI Chat** | Assistente con tool `preparaOrdine` → card “Conferma e Paga” |

---

## Assistente AI

- Endpoint: `POST /api/chat` (Vercel AI SDK + **Gemini**)
- Tool `preparaOrdine(barName, item, time)` — **non** salva in DB
- La card in chat salva su Supabase solo al click **Conferma e Paga**

Esempio utente: *"ordinami un caffè al bar della statale alle 9"*

---

## Struttura principale

```
src/
  lib/supabase/     # client browser + server
  lib/ai/           # prompt, tool, resolve ordine
  components/chat/  # ChatAssistant, OrderReviewCard
  components/brand/ # Logo
  app/api/chat/     # streaming AI
  app/api/orders/   # insert Supabase
  app/auth/callback # conferma email
supabase/schema.sql
```
