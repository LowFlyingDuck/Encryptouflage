const crypto = require('crypto');
const { Transform } = require('stream');

var words = [
  'donkey', 'books', 'plastic', 'monkey', 'illegal', 'earth', 'average', 'responsible', 'dull', 'youthful', 'suggestion', 'high-pitched', 'quilt', 'obtainable', 'hissing', 'telling', 'devilish', 'cuddly', 'gray', 'stove', 'capricious', 'psychotic', 'cold', 'zip', 'judicious', 'owe', 'productive', 'calculator', 'ill', 'grin', 'sheep', 'colour', 'press', 'form', 'paint', 'quickest', 'faint', 'discover', 'capable', 'book', 'snobbish', 'healthy', 'flippant', 'grade', 'boy', 'level', 'icy', 'confused', 'alert', 'tasteless', 'pie', 'treat', 'river', 'succinct', 'overflow', 'well-off', 'dinner', 'hands', 'competition', 'window', 'cherries', 'health', 'unpack', 'boat', 'long', 'accept', 'bikes', 'furtive', 'skirt', 'prepare', 'achiever', 'decisive', 'admire', 'lackadaisical', 'bite', 'useless', 'day', 'vivacious', 'rescue', 'answer', 'eggnog', 'anxious', 'control', 'understood', 'vengeful', 'dashing', 'concerned', 'bawdy', 'moldy', 'secretary', 'substance', 'bead', 'juggle', 'nutty', 'burly', 'destruction', 'destroy', 'help', 'hungry', 'flag', 'juicy', 'practise', 'admit', 'vast', 'breakable', 'obeisant', 'punch', 'mask', 'tooth', 'courageous', 'representative', 'dapper', 'unequaled', 'launch', 'wire', 'girls', 'reach', 'chalk', 'account', 'grateful', 'rock', 'color', 'black', 'jar', 'children', 'secret', 'head', 'sheet', 'adorable', 'thin', 'deserted', 'lake', 'discussion', 'therapeutic', 'person', 'complex', 'tranquil', 'soak', 'clap', 'jam', 'confess', 'lie', 'mailbox', 'verdant', 'coat', 'lush', 'question', 'strange', 'sidewalk', 'unbecoming', 'party', 'unlock', 'lock', 'slow', 'seat', 'ethereal', 'squeeze', 'six', 'matter', 'relieved', 'marvelous', 'hole', 'love', 'hateful', 'advice', 'happy', 'beginner', 'wink', 'woman', 'slippery', 'trashy', 'fog', 'quill', 'keen', 'embarrass', 'moaning', 'uncovered', 'yoke', 'utopian', 'political', 'crook', 'act', 'cup', 'untidy', 'infamous', 'ugly', 'chunky', 'country', 'rabbit', 'steep', 'nappy', 'stroke', 'challenge', 'glib', 'toothpaste', 'enthusiastic', 'skillful', 'explode', 'meat', 'voiceless', 'common', 'size', 'cars', 'male', 'believe', 'lavish', 'tremendous', 'wide', 'big', 'forgetful', 'reflective', 'crown', 'imminent', 'dock', 'attempt', 'small', 'money', 'fair', 'vigorous', 'alive', 'determined', 'cumbersome', 'humor', 'actually', 'line', 'evasive', 'pass', 'terrify', 'plot', 'ajar', 'dark', 'grey', 'ignore', 'literate', 'spotless', 'pedal', 'suffer', 'nervous', 'tidy', 'stew', 'curl', 'stain', 'womanly', 'point', 'nonstop', 'spiritual', 'near', 'downtown', 'unsuitable', 'crack', 'guarded', 'meddle', 'knife', 'brake', 'spurious', 'vest'
];

function createLetterer() {
  return new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      callback(null, [...chunk].map(n => words[n]).join(' '));
    }
  });
}

function encr(key, algorithm = 'AES-256-CTR', iv = crypto.randomBytes(16)) {
  let letterer = createLetterer();
  let cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv);
  cipher.pipe(letterer);
  return new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      cipher.write(chunk);
      letterer.on('data', d => callback(null, iv.toString('base64') + ' ' + d));
    }
  })
}

function decr(key, algorithm = 'AES-256-CTR') {
  let buffer = '';
  let cipher;
  key = crypto.createHash('sha256').update(key).digest();
  let t = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      cipher && cipher.on('data', d => callback(null, d));
      console.log('log');
      chunk.toString().split('').forEach(b => b === ' ' ? (cipher ? cipher.write(Buffer.from([words.indexOf(buffer)])) : cipher = crypto.createCipheriv(algorithm, key, Buffer.from(buffer, 'base64')), buffer = '') : buffer += b);
    }
    // flush(callback) {
    //   cipher.write(Buffer.from([words.indexOf(buffer)]));
    //   cipher.on('data', d => callback(null, d));
    //   cipher.end();
    // }
  });
  return t;
}

module.exports = { EncryptorStream: encr, DecryptorStream: decr, createLetterer: createLetterer };