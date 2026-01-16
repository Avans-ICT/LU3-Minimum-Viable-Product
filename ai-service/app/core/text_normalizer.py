from __future__ import annotations
import re
import unicodedata
from typing import Iterable

_URL_RE = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
_EMAIL_RE = re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", re.IGNORECASE)

# Houd letters/cijfers/spaties; laat - en _ toe
# Alles anders -> spatie
_NON_WORD_RE = re.compile(r"[^\w\s\-_]+", re.UNICODE)

_MULTI_SPACE_RE = re.compile(r"\s+")

# Basis NL/EN stopwords
BASE_STOPWORDS = {
    # NL
    "de","het","een","en","of","maar","dan","dat","die","dit","deze","waar","wat","wie",
    "ik","jij","je","u","hij","zij","we","wij","jullie","hun","hen",
    "is","zijn","was","waren","wordt","worden","kan","kunnen","zal","zullen","moet","moeten",
    "met","voor","van","op","in","aan","bij","naar","tot","uit","over","onder","tussen",
    "als","ook","niet","wel","geen","meer","minder","veel","heel","soms",
    # EN
    "the","a","an","and","or","but","then","that","this","these","those","who","what","where",
    "i","you","he","she","we","they","them","his","her","our","your",
    "is","are","was","were","be","been","being","can","could","will","would","must","should",
    "with","for","from","of","on","in","at","to","into","about","over","under","between",
    "also","not","no","more","less","very","sometimes",
}

# Domein-stopwords: woorden die in moduleteksten vaak voorkomen maar weinig onderscheid geven
DOMAIN_STOPWORDS = {
    "module","modules","student","studenten","leer","leren","leert","leer je","leer jij",
    "opleiding","opleidingen","praktijk","professioneel","project","opdracht",
    "toepassen","ontwikkelen","ontwikkeling","vaardigheden","competenties",
    "kennismaking","introductie","inhoud","onderwerp","thema",
}

# Termen die je NOOIT wilt wegfilteren
KEEP_TOKENS = {"ai","ml","it","ux","ui","cs","sql","api","devops"}

def normalize_text(text: str, *, stopwords: Iterable[str] = (), min_token_len: int = 2) -> str:
    if not text:
        return ""

    # 1) Unicode normalize
    t = unicodedata.normalize("NFKC", text)

    # 2) remove urls/emails
    t = _URL_RE.sub(" ", t)
    t = _EMAIL_RE.sub(" ", t)

    # 3) lowercase
    t = t.lower()

    # 4) remove non-word symbols
    t = _NON_WORD_RE.sub(" ", t)

    # 5) whitespace normalize
    t = _MULTI_SPACE_RE.sub(" ", t).strip()

    if not t:
        return ""

    sw = set(BASE_STOPWORDS) | set(DOMAIN_STOPWORDS) | set(stopwords)

    tokens = []
    for tok in t.split(" "):
        if tok in KEEP_TOKENS:
            tokens.append(tok)
            continue
        if len(tok) < min_token_len:
            continue
        if tok.isdigit():
            continue
        if tok in sw:
            continue
        tokens.append(tok)

    return " ".join(tokens)
