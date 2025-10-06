// backend/utils/validateQuery.js  (CommonJS)

// ---------- Tunable thresholds ----------
const MIN_WORD_LEN = 3;
const MIN_VOWEL_RATIO = 0.20;
const MAX_VOWEL_RATIO = 0.80;
const MAX_CONS_RUN   = 2;
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

const looksLikeWord = (w) => {
  if (!/^[a-z]+$/.test(w)) return false;
  if (w.length < MIN_WORD_LEN) return false;
  const vowels = (w.match(/[aeiouy]/g) || []).length;
  if (vowels === 0) return false;
  const ratio = vowels / w.length;
  if (ratio < MIN_VOWEL_RATIO || ratio > MAX_VOWEL_RATIO) return false;
  const consRuns = (w.match(/[^aeiouy]+/g) || []).map(s => s.length);
  const maxConsRun = consRuns.length ? Math.max(...consRuns) : 0;
  if (maxConsRun > MAX_CONS_RUN) return false;
  if (w.length >= 7 && !/(th|ch|sh|ph|wh|qu|ing|tion|ent|est|st|nd|nt|al|er|ar|or|ion)/.test(w)) {
    return false;
  }
  return true;
};

const looksLikeAlphaNumWord = (w) => {
  if (!/^[a-z0-9]+$/.test(w)) return false;
  const lettersOnly = (w.match(/[a-z]+/g) || []).join("");
  if (lettersOnly.length < MIN_WORD_LEN) return false;
  if (/^\d{4}$/.test(w)) {
    const yr = +w;
    if (yr >= YEAR_MIN && yr <= YEAR_MAX) return false;
  }
  return looksLikeWord(lettersOnly);
};

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

  if (t.some((x) => isIsbn10(x) || isIsbn13(x))) return true;

  const englishWords   = t.filter(looksLikeWord);
  const alphaNumWords  = t.filter(looksLikeAlphaNumWord);
  const goodTokensSet  = new Set([...englishWords, ...alphaNumWords]);
  const goodCount      = goodTokensSet.size;

  if (goodCount >= 2) return true;
  if (goodCount === 1 && t.length === 1) return true;

  return false;
}

// ---------- Express middleware ----------
function validateQuery() {
  return (req, res, next) => {
    console.log("validateQuery req.query ⇒", req.query);

    const q = (req.query.q || req.query.title || req.query.keywords || "").trim();

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
