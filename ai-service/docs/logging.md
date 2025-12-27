# Logging

## Doel van logging
Logging wordt gebruikt om inzicht te krijgen in het gedrag van de applicatie tijdens runtime, zowel tijdens ontwikkeling als in productie. De logging-opzet ondersteunt:

- Debugging tijdens development
- Monitoring van applicatiegedrag
- Analyse achteraf (audit trail)
- Verantwoording van systeemgedrag

De applicatie maakt gebruik van Python’s ingebouwde `logging` framework, geconfigureerd via `logging.config.dictConfig`.

---

## Architectuurkeuze

### Waarom `logging.config.dictConfig`
Voor logging is gekozen voor een centrale configuratie via `dictConfig` omdat dit:

- Consistente logging over alle modules afdwingt
- Scheiding mogelijk maakt tussen configuratie (JSON) en code (Python)
- Logging per environment (development / production) aanpasbaar maakt
- Goed schaalbaar is bij uitbreiding (bijv. JSON logging, externe tools)

---

## Logging-bestemmingen (handlers)

De applicatie logt **tegelijkertijd** naar twee bestemmingen:

### Console
- Doel: realtime feedback tijdens draaien
- Log level: afhankelijk van environment
  - development → `DEBUG`
  - production → `INFO`
- Formatter: compact (niveau + bericht)

### Logbestand
- Bestemming: `logs/app.log`
- Handler: `RotatingFileHandler`
- Doel:
  - Debugging achteraf
  - Analyse van fouten
  - Bewijs voor verantwoording
- Log level: altijd `DEBUG`
- Logrotatie:
  - Max grootte per bestand
  - Meerdere backups (`app.log.1`, `app.log.2`, …)

Logbestanden worden **niet** opgenomen in versiebeheer (`.gitignore`).

---

## Environment-afhankelijk gedrag

Het loglevel wordt dynamisch bepaald op basis van de applicatie-environment:

- `development` / `dev` → `DEBUG`
- overige environments → `INFO`

Hierdoor is:
- tijdens development maximale informatie beschikbaar
- in productie ruis beperkt, maar detailinformatie nog wel in logfiles aanwezig

---

## Logniveaus en richtlijnen

Bij het schrijven van logregels wordt het volgende beslismodel gehanteerd:

> **INFO = wat er gebeurt**  
> **DEBUG = waarom / hoe het gebeurt**

### Richtlijnen per logniveau

| Situatie | Log level |
|--------|-----------|
| Applicatie start / shutdown | INFO |
| Recommender succesvol geladen | INFO |
| Recommendation gegenereerd | INFO |
| Verwachte maar ongewenste situatie | WARNING |
| Exception / crash | ERROR |
| Interne variabelen / beslislogica | DEBUG |
| Scores, matrix shapes, filters | DEBUG |

### Voorbeelden

```python
logger.info("Recommender ready from artifact")
logger.debug("TF-IDF matrix shape: %s", X_tfidf.shape)
logger.warning("No recommender found, returning 503")
logger.exception("Failed to initialize recommender")