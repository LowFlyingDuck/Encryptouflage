const fs = require('fs');
const { createLetterer, createDeletterer } = require('./letterer');
const crypto = require('crypto');

// let input = fs.createReadStream('./test.txt');
// let output = fs.createWriteStream('./test.encr');

// let iv = Buffer.from('0123456789123456');
// let key = 'mysecretkey';
// let algorithm = 'aes-256-gcm';

function encrypt({ instream, outstream, key, iv = crypto.randomBytes(16), algorithm = 'aes-256-gcm', lettered = true }) {
  if (lettered) var d = createLetterer(iv);
  instream
    .pipe(crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv))
    .pipe(lettered ? (d.pipe(outstream), d) : outstream);
  return iv;
}
function decrypt({ instream, outstream, key, algorithm = 'aes-256-gcm', lettered = true }) {
  if (lettered) {
    let d = createDeletterer();
    instream.pipe(d);
    d.oniv = function (iv) {
      d
        .pipe(crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv))
        .pipe(outstream);
    }
  }
}
// encrypt({ instream: input, outstream: output, key: key, iv: iv, lettered: true });
decrypt({ instream: fs.createReadStream('./test.encr'), outstream: fs.createWriteStream('./test.decr'), lettered: true, key: 'mysecretkey' });