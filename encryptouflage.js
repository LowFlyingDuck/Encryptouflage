const crypto = require('crypto');

var words = [
  'donkey', 'books', 'plastic', 'monkey', 'illegal', 'earth', 'average', 'responsible', 'dull', 'youthful', 'suggestion', 'high-pitched', 'quilt', 'obtainable', 'hissing', 'telling', 'devilish', 'cuddly', 'gray', 'stove', 'capricious', 'psychotic', 'cold', 'zip', 'judicious', 'owe', 'productive', 'calculator', 'ill', 'grin', 'sheep', 'colour', 'press', 'form', 'paint', 'quickest', 'faint', 'discover', 'capable', 'book', 'snobbish', 'healthy', 'flippant', 'grade', 'boy', 'level', 'icy', 'confused', 'alert', 'tasteless', 'pie', 'treat', 'river', 'succinct', 'overflow', 'well-off', 'dinner', 'hands', 'competition', 'window', 'cherries', 'health', 'unpack', 'boat', 'long', 'accept', 'bikes', 'furtive', 'skirt', 'prepare', 'achiever', 'decisive', 'admire', 'lackadaisical', 'bite', 'useless', 'day', 'vivacious', 'rescue', 'answer', 'eggnog', 'anxious', 'control', 'understood', 'vengeful', 'dashing', 'concerned', 'bawdy', 'moldy', 'secretary', 'substance', 'bead', 'juggle', 'nutty', 'burly', 'destruction', 'destroy', 'help', 'hungry', 'flag', 'juicy', 'practise', 'admit', 'vast', 'breakable', 'obeisant', 'punch', 'mask', 'tooth', 'courageous', 'representative', 'dapper', 'unequaled', 'launch', 'wire', 'girls', 'reach', 'chalk', 'account', 'grateful', 'rock', 'color', 'black', 'jar', 'children', 'secret', 'head', 'sheet', 'adorable', 'thin', 'deserted', 'lake', 'discussion', 'therapeutic', 'person', 'complex', 'tranquil', 'soak', 'clap', 'jam', 'confess', 'lie', 'mailbox', 'verdant', 'coat', 'lush', 'question', 'strange', 'sidewalk', 'unbecoming', 'party', 'unlock', 'lock', 'slow', 'seat', 'ethereal', 'squeeze', 'six', 'matter', 'relieved', 'marvelous', 'hole', 'love', 'hateful', 'advice', 'happy', 'beginner', 'wink', 'woman', 'slippery', 'trashy', 'fog', 'quill', 'keen', 'embarrass', 'moaning', 'uncovered', 'yoke', 'utopian', 'political', 'crook', 'act', 'cup', 'untidy', 'infamous', 'ugly', 'chunky', 'country', 'rabbit', 'steep', 'nappy', 'stroke', 'challenge', 'glib', 'toothpaste', 'enthusiastic', 'skillful', 'explode', 'meat', 'voiceless', 'common', 'size', 'cars', 'male', 'believe', 'lavish', 'tremendous', 'wide', 'big', 'forgetful', 'reflective', 'crown', 'imminent', 'dock', 'attempt', 'small', 'money', 'fair', 'vigorous', 'alive', 'determined', 'cumbersome', 'humor', 'actually', 'line', 'evasive', 'pass', 'terrify', 'plot', 'ajar', 'dark', 'grey', 'ignore', 'literate', 'spotless', 'pedal', 'suffer', 'nervous', 'tidy', 'stew', 'curl', 'stain', 'womanly', 'point', 'nonstop', 'spiritual', 'near', 'downtown', 'unsuitable', 'crack', 'guarded', 'meddle', 'knife', 'brake', 'spurious', 'vest'
];

function EncryptorStream(key, algorithm = 'AES-256-CTR', iv = crypto.randomBytes(16)) {
  // cipher setup
  this.iv = iv;
  this.cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key).digest(), iv);

  // event listeners
  this.listeners = {};
  this.on = function (event, listener) {
    this.listeners[event] = listener;
    return this;
  };
  this.once = function () { return this };
  this.emit = function () { return this };

  this.pipe = function (output = { write: undefined, end: undefined }) {
    this.on('data', d => {
      output.write(d);
    });
    this.on('end', () => {
      output.end();
    });
    return this;
  };

  // input
  this.write = function (d) {
    this.cipher.write(d);
  };

  // output
  this.end = () => { this.cipher.end() };
  this.cipher.once('data', () => {
    typeof this.listeners['data'] === 'function' && this.listeners['data'](Buffer.from(this.iv).toString('base64') + ' ');
  });
  this.cipher.on('data', d => {
    typeof this.listeners['data'] === 'function' && this.listeners['data']([...d].map(n => words[n]).join(' '));
  });
  this.cipher.on('end', () => {
    typeof this.listeners['end'] === 'function' && this.listeners['end']();
  });
}

module.exports = EncryptorStream;