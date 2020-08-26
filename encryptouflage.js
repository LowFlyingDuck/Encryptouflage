const fs = require('fs');
const { createLetterer, createDeletterer } = require('./letterer');
const crypto = require('crypto');
function encrypt({ instream, outstream, key, algorithm = 'aes-256-ctr',  lettered = true, iv = crypto.randomBytes(16) }) {
  if (lettered) var d = createLetterer(iv);
  instream
    .pipe(crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv))
    .pipe(lettered ? (d.pipe(outstream), d) : outstream);
  return iv;
}
function encryptStatic({ data, key, iv = crypto.randomBytes(16), algorithm = 'aes-256-ctr', lettered = true }) {
  let cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv);
  if (lettered) {
    return new Promise((resolve, reject) => {
      let letterer = createLetterer(iv);
      let returnData = [];
      letterer.on('data', d => {
        returnData.push([...d]);
      });
      letterer.write(cipher.update(data), cipher.final());
      letterer.end();
      letterer.on('end', () => resolve(Buffer.concat(returnData.map(b => Buffer.from(b)))));
      letterer.on('error', err => reject(err));
    });
  } else {
    return {
      data: Buffer.concat([cipher.update(data), cipher.final()]),
      iv: iv
    };
  }
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
function decryptStatic({ data, key, iv, algorithm = 'aes-256-ctr', lettered = true }) {
  if (lettered) {
    return new Promise((resolve, reject) => {
      let deletterer = createDeletterer();
      deletterer.oniv = (iv) => {
        let returnData = [];
        let decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv);
        deletterer.pipe(decipher);
        decipher.on('data', d => {
          returnData.push([...d]);
        })
        decipher.on('end', () => resolve(Buffer.concat(returnData.map(b => Buffer.from(b)))));
      };
      deletterer.write(data);
      deletterer.end();
    })
  } else {
    let decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv);
    return Buffer.from(cipher.update(data) + cipher.final());
  }
}
module.exports = { encrypt: encrypt, decrypt: decrypt, encryptStatic: encryptStatic, decryptStatic: decryptStatic };