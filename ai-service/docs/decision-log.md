# Decision Log – LU3 AI Recommender Service

Dit document bevat de belangrijkste architecturale en technische beslissingen die zijn genomen tijdens de ontwikkeling van de LU3 AI Recommender Service.  
Per beslissing wordt de motivatie en eventuele alternatieven beschreven, zodat keuzes achteraf verantwoord en herleidbaar zijn.

---

## ADR-001 — Aparte AI-service
**Beslissing:**  
De AI-functionaliteit is ondergebracht in een aparte service, los van de backend.

**Motivatie:**  
- Duidelijke scheiding van verantwoordelijkheden
- Onafhankelijke schaalbaarheid van AI-inference
- Minder complexiteit in de backend
- Makkelijker te onderhouden en te testen

**Alternatieven:**  
- AI-logica integreren in de backend  
  → Afgewezen vanwege verminderde onderhoudbaarheid en schaalbaarheid.

---

## ADR-002 — FastAPI als framework voor AI-service
**Beslissing:**  
FastAPI is gekozen als framework voor de AI-service.

**Motivatie:**  
- Hoge performance en lage overhead
- Sterke typing en inputvalidatie via Pydantic
- Automatische OpenAPI-documentatie
- Zeer geschikt voor ML inference workloads

**Alternatieven:**  
- Flask → Minder type-safety en structuur  
- Django → Te zwaar voor een inference-only service

---

## ADR-003 — Inference-only AI-service
**Beslissing:**  
De AI-service voert uitsluitend inference uit en geen modeltraining.

**Motivatie:**  
- Modeltraining is resource-intensief
- Vermijdt instabiliteit tijdens runtime
- Betere controle en reproduceerbaarheid via offline training

**Gevolg:**  
Training vindt plaats via aparte scripts en pipelines buiten de API.

---

## ADR-004 — Offline batch retraining
**Beslissing:**  
Het model wordt periodiek offline opnieuw getraind op basis van verzamelde feedback.

**Motivatie:**  
- Stabieler dan online learning
- Minder gevoelig voor ruis en foutieve feedback
- Beter te evalueren en te vergelijken met eerdere modellen

**Alternatieven:**  
- Online learning  
  → Afgewezen vanwege complexiteit en risico op model-degradatie.

---

## ADR-005 — Content-based recommender als basis
**Beslissing:**  
Het systeem start met een content-based aanbevelingsmodel.

**Motivatie:**  
- Geen cold-start probleem
- Beperkte hoeveelheid gebruikersdata in MVP-fase
- Goed uitlegbaar en transparant
- Snelle implementatie

**Toekomst:**  
Uitbreiding naar hybride modellen (content + collaborative filtering) blijft mogelijk.

---

## ADR-006 — Feedbackgestuurde re-ranking
**Beslissing:**  
Gebruikersfeedback wordt gebruikt om een rankingmodel te trainen dat aanbevelingen herordent.

**Motivatie:**  
- Sluit aan bij Netflix-achtig aanbevelingsgedrag
- Verbetert aanbevelingskwaliteit zonder volledige modelherbouw
- Goed schaalbaar en uitlegbaar

---

## ADR-007 — Gescheiden logging van events en feedback
**Beslissing:**  
Recommendation exposure (events) en feedback worden in aparte tabellen opgeslagen.

**Motivatie:**  
- Duidelijke data lineage
- Geschikt voor analyse en training
- Voorkomt ambiguïteit in feedbackinterpretatie
- Industriestandaard aanpak

---

## ADR-008 — Model artifacts met versiebeheer
**Beslissing:**  
Getrainde modellen worden opgeslagen als versie-gebaseerde artifacts.

**Motivatie:**  
- Reproduceerbaarheid van resultaten
- Mogelijkheid tot rollback
- Traceerbaarheid van aanbevelingen via `model_version`

**Implementatie:**  
`ml/artifacts/{version}/` met een `current` pointer.

---

## ADR-009 — Geen directe database writes in AI-service
**Beslissing:**  
De AI-service schrijft geen data weg naar de database.

**Motivatie:**  
- Beperkt verantwoordelijkheden van de AI-service
- Backend behoudt controle over data-integriteit
- Vereenvoudigt security en testing

---

## ADR-010 — Explainability buiten scope MVP
**Beslissing:**  
Er wordt geen explainability UI geïmplementeerd in het MVP.

**Motivatie:**  
- Focus op functionele werking en feedback-loop
- Beperkte tijd en scope
- Opgenomen als backlog-item voor latere iteraties

---

## Status
**Status:** Actief  
Dit decision log wordt aangevuld wanneer nieuwe architecturale of technische keuzes worden gemaakt.