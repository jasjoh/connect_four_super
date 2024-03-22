/** Simple function to generate hexadecimal MD5 hashes from strings */
function generateMD5HashHex(string) {
  let currentHashVal = 0;

  for (let char of string) {
    currentHashVal = (currentHashVal << 5) - currentHashVal + char.charCodeAt(0);
  }

  return (currentHashVal >>> 0).toString(16);
}

/** Generates and returns a pseudo-random hex color */
function generateRandomHexColor() {
  const randNum = Math.floor(Math.random() * 9999999 + 100000000);
  return randNum.toString(16).slice(0, 6);
}

export { generateMD5HashHex, generateRandomHexColor };