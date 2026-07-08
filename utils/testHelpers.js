function buildUniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = { buildUniqueSuffix };
