// CJS shim for nanoid used in Jest (jsdom does not support ESM node_modules)
let counter = 0;
const nanoid = (size) => {
  counter++;
  return `test-id-${counter}-${Math.random().toString(36).slice(2)}`;
};
const customAlphabet = () => nanoid;

module.exports = { nanoid, customAlphabet };
