import _ from "lodash"

export const books = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea',
'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
'1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
'1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']

export const kinds = {
  intro:'intro',
  watch:'watch',
  teacherGuide:'teacherGuide',
  speed:'speed',
  schmoment:'schmoment',
  joSchmo:'joSchmo',
  music:'music',
  karaoke:'karaoke',
  discussion:'discussion',
  dance:'dance',
  echo:'echo',
  coloring:'coloring',
  craft:'craft',
  book:'book',
  princessRead:'princessRead',
  blooper:'blooper',
  review:'review',
  smash:'smash',
  speedyWeedy:'speedyWeedy',
  kidRecite: 'kidRecite',
  kidSchmo: 'kidSchmo',
}
// Also add kinds to resourcesForKinds and to media.js

export const kidModeKinds = {
  intro: 'intro',
  watch: 'watch',
  teacherGuide: 'teacherGuide',
  speed: 'speed',
  schmoment: 'schmoment',
  joSchmo: 'joSchmo',
  music: 'music',
  karaoke: 'karaoke',
  discussion: 'discussion',
  dance: 'dance',
  echo: 'echo',
  coloring: 'coloring',
  craft: 'craft',
  book: 'book',
  princessRead: 'princessRead',
  blooper: 'blooper',
  review: 'review',
  smash: 'smash',
  speedyWeedy: 'speedyWeedy',
  kidRecite: 'kidRecite',
  kidSchmo: 'kidSchmo',
}

export const resoucesForKinds = {
  intro:['intro'],
  watch:['watch'],
  teacherGuide:['teacherGuide'],
  // speed:['watch', 'timestamps'],
  speed:['speed'],
  schmoment:['schmoment'],
  joSchmo:['joSchmo'],
  music:['music'],
  karaoke:['karaoke'],
  discussion:['discussion'],
  dance:['dance'],
  // echo:['watch', 'karaoke', 'timestamps'],
  echo:['echo'],
  coloring:['coloring'],
  craft:['craft'],
  book:['popupBook'],
  princessRead:['princessRead'],
  blooper:['blooper'],
  review:['review'],
  smash:['smash'],
  speedyWeedy:['speedyWeedy'],
  kidRecite: ['kidRecite'],
  kidSchmo: ['kidSchmo'],
}

export function getKidKinds(moduleResource) {
  if(!moduleResource) return []
  return Object.keys(kidModeKinds).filter(
    k=>resoucesForKinds[k].every(r=>moduleResource[r])
  )
}

export function getAllKinds(moduleResource) {
  if(!moduleResource) return []
  return Object.keys(kinds).filter(
    k=>resoucesForKinds[k].every(r=>moduleResource[r])
  )
}

// Adventure Path helpers
// return array of modules for path given resources
export function getModulesForPath(resources, path) {
  let b = path.split(' ')
  // TODO: accomidate book names with a space
  let book = b[0], chapter = b[1]
  return Object.keys(resources).filter(module => {
    let s = scriptureFromKey(module)
    return (!book || s.book === book) && (!chapter || s.chapter === chapter)
  })
}

const pathActivities = [
  kinds.intro,
  kinds.speed,
  kinds.joSchmo,
  kinds.schmoment, 
  kinds.kidSchmo,
  kinds.dance,
  kinds.coloring,
  kinds.watch,
  kinds.kidRecite,
  kinds.blooper,
  kinds.speedyWeedy,
  kinds.princessRead,
  kinds.review,
  kinds.echo,
  kinds.book,
  kinds.karaoke,
  kinds.smash,
]

// return array of activity kinds for module given resources
export function getPathActivities(resources, module) {
  return pathActivities.filter(
    k=>resoucesForKinds[k].every(r=>resources[module][r])
  )
}

export const keyFromScripture = (book, chapter, verses) => {
  if(chapter) {
    if(verses) {
      // all exist
      let [startVerse, endVerse] = verses.split('-')
      return `${String(books.indexOf(book)).padStart(2,'0')}-${String(chapter).padStart(3,'0')}-${String(startVerse).padStart(3,'0')}-${String(endVerse).padStart(3,'0')}`
    }
    // book, chap, no verses
    return `${String(books.indexOf(book)).padStart(2,'0')}-${String(chapter).padStart(3,'0')}`
  }
  // only book
  return `${String(books.indexOf(book)).padStart(2,'0')}`
}

export const scriptureFromKey = key => {
  let r = key.split('-')
  if(r.length == 4) {
    return {book: books[Number(r[0])], chapter: Number(r[1]), verses: `${Number(r[2])}-${Number(r[3])}`}
  }
  if(r.length == 2) {
    return {book: books[Number(r[0])], chapter: Number(r[1])}
  }
  if(r.length == 1) {
    return {book: books[Number(r[0])]}
  }
}

export function friendlyScriptureRef(key) {
  let s = scriptureFromKey(key)
  let ref = s.book
  if(s.chapter) ref += ' ' + s.chapter
  if(s.verses) ref += ':' + s.verses
  return ref
}

// this is a mathematically correct mod accounting for negative numbers
// mod(n, m) returns i where 0 <= i < m, where n - i is divisible by m
export function mod(n, m) {
  let tmp = n % m
  return tmp >= 0 ? tmp : tmp + m
}

export function valueAfter(arr, val, n=1, returnIndex=false) {
  for(let i in arr) {
    if(_.isEqual(arr[i], val)) {
      let j = mod((+i+n), arr.length)
      if(returnIndex) return j
      return arr[j]
    }
  }
  return arr[0]
}

export function toTitleCase(str) {
  return str.trim().replace(/\b[a-z]|['_][a-z]|\B[A-Z]/g, function(x){return x[0]==="'"||x[0]==="_"?x:String.fromCharCode(x.charCodeAt(0)^32)})
}
