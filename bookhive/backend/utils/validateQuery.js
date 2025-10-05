// backend/utils/validateQuery.js  (CommonJS)

// ---------- Tunable thresholds ----------
const MIN_WORD_LEN = 3;   // single-word queries must have ≥ this many letters
const MIN_VOWEL_RATIO = 0.20; // ↓ was 0.30
const MAX_VOWEL_RATIO = 0.80;
const MAX_CONS_RUN   = 2; // reject if any consonant run length > this
const YEAR_MIN = 1800;
const YEAR_MAX = 2099;

// ---------- helpers ----------
const tokenize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

// stricter english-ish word (letters only)
const looksLikeWord = (w) => {
  if (!/^[a-z]+$/.test(w)) return false;
  if (w.length < MIN_WORD_LEN) return false;

  // count y as a vowel
  const vowels = (w.match(/[aeiouy]/g) || []).length;
  if (vowels === 0) return false;

  const ratio = vowels / w.length;
  if (ratio < MIN_VOWEL_RATIO || ratio > MAX_VOWEL_RATIO) return false;

  // reject long consonant runs like "wenvivrvr" -> "rvr"
  const consRuns = (w.match(/[^aeiouy]+/g) || []).map(s => s.length);
  const maxConsRun = consRuns.length ? Math.max(...consRuns) : 0;
  if (maxConsRun > MAX_CONS_RUN) return false;

  // for longer tokens, require at least one common bigram/trigram
  if (w.length >= 7 && !/(th|ch|sh|ph|wh|qu|ing|tion|ent|est|st|nd|nt|al|er|ar|or|ion)/.test(w)) {
    return false;
  }

  return true;
};

// alphanumeric tokens allowed only if they contain ≥3 letters overall
// and the letters portion passes the stricter word check
const looksLikeAlphaNumWord = (w) => {
  if (!/^[a-z0-9]+$/.test(w)) return false;
  const lettersOnly = (w.match(/[a-z]+/g) || []).join("");
  if (lettersOnly.length < MIN_WORD_LEN) return false;

  // block bare 4-digit years
  if (/^\d{4}$/.test(w)) {
    const yr = +w;
    if (yr >= YEAR_MIN && yr <= YEAR_MAX) return false;
  }

  return looksLikeWord(lettersOnly);
};

// ISBN checks
const isIsbn10 = (s) => {
  if (!/^\d{9}[\dXx]$/.test(s)) return false;
  const sum = [...s.toUpperCase()].reduce(
    (acc, ch, i) => acc + (ch === "X" ? 10 : +ch) * (10 - i),
    0
  );
  return sum % 11 === 0;
};

const isIsbn13 = (s) => {
  if (!/^\d{13}$/.test(s)) return false;
  const sum = [...s].reduce((acc, d, i) => acc + (+d) * (i % 2 ? 3 : 1), 0);
  return sum % 10 === 0;
};

// ---------- core rule ----------
function isMeaningfulQuery(q) {
  const t = tokenize(q);
  if (t.length === 0) return false;

  // ISBNs always allowed
  if (t.some((x) => isIsbn10(x) || isIsbn13(x))) return true;

  const englishWords   = t.filter(looksLikeWord);
  const alphaNumWords  = t.filter(looksLikeAlphaNumWord);
  const goodTokensSet  = new Set([...englishWords, ...alphaNumWords]);
  const goodCount      = goodTokensSet.size;

  if (goodCount >= 2) return true;                    // multi-word query
  if (goodCount === 1 && t.length === 1) return true; // single valid word

  return false;
}

// Express middleware: 422 on bad query
function validateQuery() {
  return (req, res, next) => {
    const q = (req.query.q || "").trim();
    if (!isMeaningfulQuery(q)) {
      return res.status(422).json({
        error:
          "Please enter real keywords (an English-like word ≥3 letters) or a valid ISBN.",
      });
    }
    next();
  };
}

module.exports = { validateQuery, isMeaningfulQuery };
