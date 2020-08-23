const crypto = require('crypto');
const { Transform } = require('stream');
const { write } = require('fs');
const { defaultCoreCipherList } = require('constants');

var words = [
  'donkey', 'books', 'plastic', 'monkey', 'illegal', 'earth', 'average', 'responsible', 'dull', 'youthful', 'suggestion', 'high-pitched', 'quilt', 'obtainable', 'hissing', 'telling', 'devilish', 'cuddly', 'gray', 'stove', 'capricious', 'psychotic', 'cold', 'zip', 'judicious', 'owe', 'productive', 'calculator', 'ill', 'grin', 'sheep', 'colour', 'press', 'form', 'paint', 'quickest', 'faint', 'discover', 'capable', 'book', 'snobbish', 'healthy', 'flippant', 'grade', 'boy', 'level', 'icy', 'confused', 'alert', 'tasteless', 'pie', 'treat', 'river', 'succinct', 'overflow', 'well-off', 'dinner', 'hands', 'competition', 'window', 'cherries', 'health', 'unpack', 'boat', 'long', 'accept', 'bikes', 'furtive', 'skirt', 'prepare', 'achiever', 'decisive', 'admire', 'lackadaisical', 'bite', 'useless', 'day', 'vivacious', 'rescue', 'answer', 'eggnog', 'anxious', 'control', 'understood', 'vengeful', 'dashing', 'concerned', 'bawdy', 'moldy', 'secretary', 'substance', 'bead', 'juggle', 'nutty', 'burly', 'destruction', 'destroy', 'help', 'hungry', 'flag', 'juicy', 'practise', 'admit', 'vast', 'breakable', 'obeisant', 'punch', 'mask', 'tooth', 'courageous', 'representative', 'dapper', 'unequaled', 'launch', 'wire', 'girls', 'reach', 'chalk', 'account', 'grateful', 'rock', 'color', 'black', 'jar', 'children', 'secret', 'head', 'sheet', 'adorable', 'thin', 'deserted', 'lake', 'discussion', 'therapeutic', 'person', 'complex', 'tranquil', 'soak', 'clap', 'jam', 'confess', 'lie', 'mailbox', 'verdant', 'coat', 'lush', 'question', 'strange', 'sidewalk', 'unbecoming', 'party', 'unlock', 'lock', 'slow', 'seat', 'ethereal', 'squeeze', 'six', 'matter', 'relieved', 'marvelous', 'hole', 'love', 'hateful', 'advice', 'happy', 'beginner', 'wink', 'woman', 'slippery', 'trashy', 'fog', 'quill', 'keen', 'embarrass', 'moaning', 'uncovered', 'yoke', 'utopian', 'political', 'crook', 'act', 'cup', 'untidy', 'infamous', 'ugly', 'chunky', 'country', 'rabbit', 'steep', 'nappy', 'stroke', 'challenge', 'glib', 'toothpaste', 'enthusiastic', 'skillful', 'explode', 'meat', 'voiceless', 'common', 'size', 'cars', 'male', 'believe', 'lavish', 'tremendous', 'wide', 'big', 'forgetful', 'reflective', 'crown', 'imminent', 'dock', 'attempt', 'small', 'money', 'fair', 'vigorous', 'alive', 'determined', 'cumbersome', 'humor', 'actually', 'line', 'evasive', 'pass', 'terrify', 'plot', 'ajar', 'dark', 'grey', 'ignore', 'literate', 'spotless', 'pedal', 'suffer', 'nervous', 'tidy', 'stew', 'curl', 'stain', 'womanly', 'point', 'nonstop', 'spiritual', 'near', 'downtown', 'unsuitable', 'crack', 'guarded', 'meddle', 'knife', 'brake', 'spurious', 'vest'
];

function createLetterer(iv) {
  let t = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      callback(null, (iv ? iv.toString('base64') + ' ' : (iv = false, '')) + [...chunk].map(n => words[n]).join(' '));
    },
    flush(callback) {
      callback(null, '');
    }
  });
  t.iv = undefined;
  return t;
}

function createDeletterer() {
  let t = new Transform({
    writableObjectMode: true,
    transform(chunk, encdoding, callback) {
      chunk = this.last + chunk.toString();
      let arr = chunk.split(' ');
      if (!this.iv) {
        this.iv = Buffer.from(arr.shift(), 'base64');
        this.oniv(this.iv);
      };
      this.last = arr.pop();
      callback(null, Buffer.from(arr.map(w => words.indexOf(w))));
    },
    flush(callback) {
      callback(null, Buffer.from([words.indexOf(this.last)]));
    }
  });
  t.oniv = new Function();
  t.last = '';
  t.iv = undefined;
  return t;
}

module.exports = { createLetterer: createLetterer, createDeletterer: createDeletterer };