```javascript
const encryptouflage = require('encryptouflage');
const fs = require('fs');

encryptouflage.encrypt({
  instream: fs.createReadStream('./input.txt'),
  outstream: fs.createWriteStream('./output.encr'),
  key: 'mysecretkey'
});
encryptouflage.decrypt({
  instream: fs.createReadStream('./input.encr'),
  outstream: fs.createWriteStream('./output.txt'),
  key: 'mysecretkey'
});
```

# Encryption
This is a module, that can encrypt and decrypt messsages.

## About
With this module you can encrypt and decrypt any text message. This might be useful for encrypting Emails or Files in order to prevent third parties from monitoring the matter.
 
By default, the encrypted message is output in "lettered" format, camouflaging the message to automated email filters.

# License
Encryptouflage is MIT licensed. You can find out more and read the license document [here](LICENSE).
