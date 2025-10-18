// SRP: text normalization + keyword extraction
const DEFAULT_STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","is","are","was","were","be","to","of",
  "in","on","for","by","with","as","at","from","that","this","it","its","into","over",
  "between","about","after","before","than","so","such","their","his","her","they",
  "them","you","we","i"
]);

class Tokenizer {
  constructor({ stopwords = DEFAULT_STOPWORDS } = {}) {
    this.stop = stopwords;
  }
  // Simple whitespace + punctuation tokenizer, lowercases, removes stopwords
  // and short tokens (<=2 chars)
  // Returns array of tokens
  tokens(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(t => t && !this.stop.has(t) && t.length > 2);
  }
  // Returns top N terms by weight from a term-frequency map
  //Sorted descending by weight
  //returns array of {name, weight}
  topN(tfMap, n = 50) {
    return Object.entries(tfMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, weight]) => ({ name, weight }));
  }
}

module.exports = { Tokenizer };
