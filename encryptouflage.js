const crypto = require('crypto');

function EncryptorStream(algorithm = 'AES-256-CTR', key) {
  this.iv = crypto.randomBytes(256);
  this.cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), );
}

module.exports = EncryptorStream();