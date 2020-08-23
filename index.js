const fs = require('fs');
const { createLetterer, createDeletterer } = require('./letterer');
const crypto = require('crypto');

function encrypt({ instream, outstream, key, iv = crypto.randomBytes(16), algorithm = 'aes-256-ctr', lettered = true }) {
  if (lettered) var d = createLetterer(iv);
  instream
    .pipe(crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv))
    .pipe(lettered ? (d.pipe(outstream), d) : outstream);
  return iv;
}
function decrypt({ instream, outstream, key, algorithm = 'aes-256-ctr', lettered = true, iv }) {
  if (lettered) {
    let d = createDeletterer();
    instream.pipe(d);
    d.oniv = function (iv) {
      let decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv, { encoding: 'utf-8' });
      // decipher.setAuthTag();
      d
        .pipe(decipher)
        .pipe(outstream);
    } 
  } else {
    instream
      .pipe(crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv))
      .pipe(outstream);
  }
}
// encrypt({ instream: fs.createReadStream('./test.txt'), outstream: fs.createWriteStream('./test.encr'), key: 'mysecretkey', lettered: true });
// decrypt({ instream: fs.createReadStream('./test.encr'), outstream: fs.createWriteStream('./test.decr'), lettered: true, key: 'mysecretkey' });