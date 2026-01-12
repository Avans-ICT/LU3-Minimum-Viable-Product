# Data Model – LU3 AI Recommender Service

## 1. Doel van dit document
Dit document beschrijft het **datamodel** van de LU3 AI Recommender Service.  
De focus ligt op hoe aanbevelingen en gebruikersfeedback worden opgeslagen in MongoDB, zodat:

- aanbevelingen herleidbaar zijn
- feedback kan worden geanalyseerd
- het AI-model kan worden hertraind
- architecturale keuzes verantwoord kunnen worden

Het datamodel is afgestemd op een **MongoDB-omgeving** en volgt een **event-based logging aanpak**.

---

## 2. Overzicht van collections
De MongoDB-database bevat onder andere de volgende collections:

- `users` – gebruikersaccounts
- `profiles` – aanvullende gebruikerscontext
- `modules` – beschikbare keuzemodules
- `recommendation_events` – gelogde aanbevelingen (exposure)
- `recommendation_feedback` – gebruikersfeedback op aanbevelingen

Dit document focust op de **recommendation_events** en **recommendation_feedback** collections.

---

## 3. Ontwerpkeuze: events + feedback gescheiden
Aanbevelingen en feedback worden bewust in **twee aparte collections** opgeslagen.

**Redenen:**
- Eén aanbeveling kan meerdere feedback-acties hebben (click + like)
- Feedback groeit sneller dan events
- Betere analyse- en trainingsmogelijkheden
- Sluit aan bij industriestandaarden (zoals Netflix)

---

## 4. Collection: `recommendation_events`

### Doel
De `recommendation_events` collectie logt **welke aanbevelingen zijn getoond**, **aan wie**, **onder welke context** en **met welk model**.

Elke record vertegenwoordigt één aanbevelingsmoment (exposure).

---

### Velden

#### `event_type : string`
Type event dat is vastgelegd.  
Voor het MVP is dit standaard:
- `"recommendation_served"`

Dit veld maakt toekomstige uitbreiding mogelijk.

---

#### `created_at : datetime`
Tijdstip waarop de aanbeveling is gegenereerd.  
Wordt gebruikt voor:
- analyse
- retraining op recente data
- debugging

---

#### `user_id : ObjectId?`
Referentie naar de gebruiker (`users._id`).  
- Kan `null` zijn voor anonieme gebruikers
- Indien `null`, wordt `session_id` gebruikt

---

#### `session_id : string`
Identificeert de gebruikerssessie.  
Wordt **altijd opgeslagen**, ook wanneer `user_id` bekend is.

Doeleinden:
- ondersteuning van anonieme gebruikers
- multi-device tracking
- fallback bij ontbrekende user-id

---

#### `request_id : string`
Unieke identifier per request (bijv. UUID).

Gebruikt voor:
- tracing in logs
- correlatie tussen backend en AI-service
- voorkomen van dubbele writes

---

#### `algorithm : string`
Naam van het gebruikte aanbevelingsalgoritme.

Voorbeelden:
- `"content-based"`
- `"content-based+ranker"`

Wordt gebruikt om:
- prestaties per algoritme te vergelijken
- modelgedrag te analyseren

---

#### `model_version : string`
Versie van het AI-model dat de aanbeveling heeft gegenereerd.

Voorbeeld:
- `"2025-12-24_001"`

Cruciaal voor:
- retraining
- rollback
- A/B testing
- reproduceerbaarheid

---

#### `k : int`
Aantal aanbevelingen dat is teruggegeven.

Voorbeeld:
- `5`

Relevant omdat metrics en gebruikerservaring afhankelijk zijn van `k`.

---

#### `input_interests_text : string`
De ruwe gebruikersinput waarop de aanbeveling is gebaseerd.

Voorbeeld:
- `"security netwerken ethical hacking"`

Wordt gebruikt voor:
- analyse
- reconstructie van trainingsdata
- explainability

---

### Constraints (filters)

#### `constraints_location : string?`
Optioneel filter op locatie.

Voorbeeld:
- `"Den Bosch"`

---

#### `constraints_level : string?`
Optioneel filter op niveau.

Voorbeeld:
- `"NLQF5"`

---

#### `constraints_studycredits_min : int?`
Minimum aantal studiepunten (optioneel).

---

#### `constraints_studycredits_max : int?`
Maximum aantal studiepunten (optioneel).

Deze velden leggen vast **waarom bepaalde modules wel of niet zijn meegenomen**.

---

### Results (aanbevelingen)

#### `results : array<object>`
Bevat de lijst van aanbevolen modules **in de volgorde waarin ze aan de gebruiker zijn getoond**.

De volgorde van de array is essentieel voor ranking-analyse.

---

#### `results[].module_id : ObjectId`
Referentie naar de aanbevolen module (`modules._id`).

---

#### `results[].rank : int`
De positie van de aanbeveling in de lijst.
- `1` = hoogste aanbeveling

Wordt gebruikt voor:
- ranking metrics
- position bias analyse

---

#### `results[].score : double`
De eindscore waarop de aanbeveling is gerangschikt.

Voorbeelden:
- cosine similarity
- kansscore van rankingmodel

---

#### `results[].reasons : object (optioneel)`
Optionele uitleg of feature-logging per aanbeveling.

Voorbeeld:
```json
{
  "content_sim": 0.82,
  "constraint_score": 1.0
}