# Encryption
This is a module, that can encrypt and decrypt messsages. (API Integration)

## About
With this module you can encrypt and decrypt any text message. This might be useful for encrypting Emails or Files in order to prevent third parties from monitoring the matter.
 
By default, the encrypted message is output in "lettered" format, camouflaging the message to automated email filters.

## Usage
require the module
``` javascript
const encryptouflage = require('encryptouflage');
```
### encrypt
``` javascript
encryptouflage.encrypt({ options })
```
#### `options`:

<dl>
<ul>
<li><dt>key</dt></li>
<dl>key / password desired to encrypt with</dt>
<li><dt>instream</dt></li>
<dl>readable stream of data, that is to be encrypted</dt>
<li><dt>outstream</dt></li>
<dl>writable stream, that the encrypted data is written to</dt>
<li><dt>algorithm (optional)</dt></li>
<dl>cipher algorithm used</dt>
<dl><strong>default:</strong> <code>'AES-256-CTR'</code><dl>
<li><dt>iv (optional)</dt></li>
<dl>initialization vector</dt>
<dl><strong>default</strong> <code>crypto.randomBytes(16)</code></dl>
<li><dt>lettered (optional)</dt></li>
<dl>use "lettered" formatting</dt>
<dl><strong>default:</strong> <code>true</code><dl>
</ul>
</dl>

#### example:
With lettered formatting\
the initialization vector is added automatically.
``` javascript
const encryptouflage = require('./encryptouflage');
const fs = require('fs');

var input = fs.createReadStream('./input.txt');
var output = fs.createWriteStream('./output.encr');
var key = 'mysecretkey';

encryptouflage.encrypt({ instream: input, outstream: output, key: key });
```
With plain formatting\
the initialization vector has to be handled manually.
``` javascript
const encryptouflage = require('./encryptouflage');
const fs = require('fs');

var input = fs.createReadStream('./input.txt');
var output = fs.createWriteStream('./output.encr');
var key = 'mysecretkey';

let iv = encryptouflage.encrypt({ instream: input, outstream: output, key: key, lettered: false });

output.on('close', function () {
  fs.appendFileSync(output.path, iv);
});
```
### decrypt
``` javascript
encryptouflage.decrypt({ options })
```
#### `options`:

<dl>
<ul>
<li><dt>key</dt></li>
<dl>correct key / password to decrypt with</dt>
<li><dt>instream</dt></li>
<dl>readable stream of data, that is to be decrypted</dt>
<li><dt>outstream</dt></li>
<dl>writable stream, that the decrypted data is written to</dt>
<li><dt>iv</dt></li>
<dl>initialization vector</dt>
<li><dt>algorithm (optional)</dt></li>
<dl>cipher algorithm used</dt>
<dl><strong>default:</strong> <code>'AES-256-CTR'</code><dl>
<li><dt>lettered (optional)</dt></li>
<dl>use "lettered" formatting</dt>
<dl><strong>default:</strong> <code>true</code><dl>
</ul>
</dl>

#### example:
With lettered formatting\
the original initialization vector is extracted automatically and therefore not required.
``` javascript
const encryptouflage = require('./encryptouflage');
const fs = require('fs');

var input = fs.createReadStream('./input.encr');
var output = fs.createWriteStream('./output.txt');
var key = 'mysecretkey';

encryptouflage.decrypt({ instream: input, outstream: output, key: key});
```
With plain formatting\
the original initialization cannot be extracted automatically and is therefore required.
``` javascript
const encryptouflage = require('./encryptouflage');
const fs = require('fs');

var input = fs.createReadStream('./input.encr');
var output = fs.createWriteStream('./output.txt');
var key = 'mysecretkey';
var iv = Buffer.from('qLhMmT0icQrCyTcyWaeT7g==', 'base64');

encryptouflage.decrypt({ instream: input, outstream: output, key: key, lettered: false, iv: iv });
```
#License
Encryptouflage is MIT licensed. You can find out more and read the license document [here](LICENSE).
