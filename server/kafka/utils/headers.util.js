function headerToString(value) {
  if (value == null) return undefined;
  if (Buffer.isBuffer(value)) return value.toString('utf8');
  return String(value);
}

function getHeader(headers, key) {
  if (!headers) return undefined;
  return headerToString(headers[key]);
}

function setHeader(headers, key, value) {
  return { ...(headers || {}), [key]: Buffer.from(String(value), 'utf8') };
}

module.exports = { getHeader, setHeader };
