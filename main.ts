import { Observable, Observer } from 'rxjs';
import randomColor, { other } from './random-color' //function randomColor fue esortada como defailt por eso no nceseita {}

console.log(randomColor());
let numbers = [1, 5, 10, 15];
let source = Observable.from(numbers);
let desc1 = 'First Observable';
let desc2 = 'second Observable';
interface Istamp {
  color: string
  shape: string
  shapeColor?: string
  index: number
  secuence?: string
}
class MyObserver implements Observer<Istamp>{
  index = 1
  secuence = ' - '
  constructor(private log: string) { }
  next(stamp: Istamp | Istamp[]) {
    if (Array.isArray(stamp)) {
      // console.table(JSON.stringify(stamp));
      let final = ''
      let last = stamp[stamp.length - 1];
      let styles: string[] = stamp.map(st => {
        return `'color:${st.shapeColor} ; font-size:15px;'`
      })

      let shapes: string[] = stamp.map(st => {
        return `%c${st.shape}`;
      })

      let rawStyles = styles.join(',');
      let rawShapes = shapes.join('');

      final += `console.info('%cresp-${this.index}%c${this.secuence}${rawShapes}','color: green;font-size:15px;', 'color: black;font-size:15px;', ${rawStyles})`
      eval(final);
    }
    else {
      console.log(`%cresp-${this.index}%c${this.secuence}%c${stamp.shape}`, `color: green; font-size:15px;`, `background:rgba(233, 235, 236, 0.74) ;color: green; font-size:15px;`, `background:${stamp.shapeColor}; border-radius:50% ; padding:3px; color:white; font-weight: bold; font-size:15px;`);
    }
    this.index += 1;
    this.secuence += '- '
    // console[this.log](stamp);
    // console.log(`%c${value.shape}(${value.index})`, `color: ${value.color}; font-size:30px;`);
  }

  error(e) {
    console.error(`error ${e}`)
  }

  complete() {
    console.info(`completed ${this.log}`)
  }
}


type shape = '#' | 'X' | '^' | 'alpha' | 'num' // console.log('random color', randomColor())

class ScmObservable {
  private observable: Observable<Istamp>;
  private index: number = 1;
  private secuence: string = ' ';
  private currentOperator: string;

  constructor(private geometry: shape = '#', private color: string = 'blue',
    private limit: number = 10, private interval: number = 1000,
    private delay = 0,
    private name = 'ObsA',
    private description = ''
  ) {
    // console.log('constructor');

    this.observable = Observable.create(this.link)
      .do((stamp: Istamp) => {
        console.log(`%c${this.name}-${stamp.index}%c${stamp.secuence}%c${stamp.shape}`, `color: ${stamp.color}; font-size:15px;`, `color: black; font-size:15px;`, `background:${stamp.shapeColor}; border-radius:50% ; padding:3px; color:white; font-weight: bold; font-size:15px;`);
      })
  }

  /* arrow fuction can capture this.. but not normal function for example like this

   link(){
     this.limit // no serviria por que no es un arrow function ????
   }*/
  link = (observer: Observer<Istamp>) => {
    let shape: string;
    setTimeout(() => {
      let interval = setInterval(() => {
        // console.log(index);
        if (this.index <= this.limit) {
          if (this.index === 1) {
            console.log(`source: ${this.description} first event`);
          }
          this.secuence += '- ';
          switch (this.geometry) {
            case "alpha":
              shape = letterByIndex(this.index);
              break;

            case "num":
              shape = this.index.toString();
              break;

            default:
              shape = this.geometry;
              break;
          }
          let st: Istamp = {
            color: this.color,
            shape,
            shapeColor: randomColor(),
            index: this.index,
            secuence: this.secuence
          }
          observer.next(st);
          this.index += 1;

        } else {
          observer.complete();
          clearInterval(interval);
        }
      }, this.interval)
    }, this.delay)
    return () => {
      console.log(`unsubscribe ${this.name}`);
      // observer.complete(); // i have to do this???
    }
  }

  getObservable(operator: string) {
    this.currentOperator = operator;
    return this.observable;
  }
}


var circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0);
var triangleGreen$ = new ScmObservable('^', 'green', 10, 1000, 5000);

// circleBlue$.getObservable()
// .map((stamp:Istamp)=> {
//   stamp.shape='^';
//   return stamp;
// })
// .filter((stamp:Istamp)=> stamp.index%3===0)
// .scan((acc: Istamp, stam: Istamp) => {
//   acc.index = stam.index;
//   acc.secuence = stam.secuence;
//   acc.shape += stam.shape;
//   return acc
// })
// .bufferCount(3)//not working
// .skip(2)
// .takeLast(1)
// .take(5)
// .takeUntil(triangleGreen$.getObservable())
// .skipUntil(triangleGreen$.getObservable()) // why i dont see the completed
// .concat(triangleGreen$.getObservable())
// .merge(triangleGreen$.getObservable())
// .flatMap((stamp) =>triangleGreen$.getObservable()) //no entendi bien
// .switchMap((stamp) =>triangleGreen$.getObservable())
// .subscribe(new MyObserver('info'))
// triangleGreen$.getObservable().subscribe(new MyObserver('error'))




let $map = document.getElementById('map');
let currentObservable: any;
// Observable<Istamp | Istamp[]>

$map.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('alpha', 'black', 10, 1000, 0);
  clean();
  currentObservable = circleBlue$.getObservable('map')
    .map((stamp: Istamp) => {
      stamp.shape += '-rxjs';
      return stamp;
    })
    .subscribe(new MyObserver('info'))
})


let $scan = document.getElementById('scan');
$scan.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0);
  let init: Istamp[] = [];
  clean();
  currentObservable = circleBlue$.getObservable('scan')
    .scan((acc: Istamp[], stamp: Istamp) => {
      acc.push(stamp);
      return acc
    }, init)
    .subscribe(new MyObserver('info'))
});

let $bufferCount = document.getElementById('buffer-count');


$bufferCount.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0);

  clean();
  circleBlue$.getObservable('bufferCount')
    .bufferCount(3)
    .subscribe(new MyObserver('info'))
})


let $skip = document.getElementById('skip');
$skip.addEventListener('click', () => {
  console.log('skip first 3 items');
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', '');
  clean();
  circleBlue$.getObservable('skip operator')
    .skip(3)
    .subscribe(new MyObserver('info'))
})

let $take = document.getElementById('take');
$take.addEventListener('click', () => {
  console.log('take first 3 items');
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', '');
  clean();
  circleBlue$.getObservable('take operator')
    .take(3)
    .subscribe(new MyObserver('info'))
})
let $startWith = document.getElementById('start-with');
$startWith.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'blue', 10, 1000, 0, 'ObsA', '');
  clean();
  circleBlue$.getObservable('startWith operator')
    .startWith(<Istamp>{
      index: 0,
      color: 'black',
      shape: '*',
      shapeColor: 'pink',
      secuence: ''
    })
    .subscribe(new MyObserver('info'))
})



let $skipWhile = document.getElementById('skip-while');
$skipWhile.addEventListener('click', () => {
  console.log('skipWhile source sent the 5 event');
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', '');
  clean();
  circleBlue$.getObservable('skipWhile operator')
    .skipWhile((stamp: Istamp) => stamp.index < 5)
    .subscribe(new MyObserver('info'))
})

let $takeWhile = document.getElementById('take-while');
$takeWhile.addEventListener('click', () => {
  console.log('takeWhile source sent the 5 event');
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', '');
  clean();
  circleBlue$.getObservable('takeWhile operator')
    .takeWhile((stamp: Istamp) => stamp.index < 5)
    .subscribe(new MyObserver('info'))
})


let $skipUntil = document.getElementById('skip-until');
$skipUntil.addEventListener('click', () => {
  // console.log('skipUntil  3 ');
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', desc1);
  let xBlack3$ = new ScmObservable('X', 'blue', 4, 1000, 2500, 'ObsB', desc2);

  clean();
  circleBlue$.getObservable(desc1)
    .skipUntil(xBlack3$.getObservable(desc2))
    .subscribe(new MyObserver('info'))
})

let $sample = document.getElementById('sample');
$sample.addEventListener('click', () => {
  // console.log('sample  3 ');
  let circleBlue$ = new ScmObservable('#', '#ffc107', 10, 1000, 0, 'ObsA', desc1);
  let xBlack3$ = new ScmObservable('X', 'blue', 4, 2500, 0, 'ObsB', desc2);

  clean();
  circleBlue$.getObservable(desc1)
    .sample(xBlack3$.getObservable(desc2))
    .subscribe(new MyObserver('info'))
})

let $switchMap = document.getElementById('switch-map');
$switchMap.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', '#ffc107', 10, 1000, 0, 'ObsA', desc1);

  clean();
  circleBlue$.getObservable(desc1)
    .switchMap((stamp) => {
      let scmO = new ScmObservable('X', 'blue', 10, 100 * stamp.index, 0, `swi${letterByIndex(stamp.index)}`, `generate switch observable ${letterByIndex(stamp.index)} `);
      let obs = scmO.getObservable('');
      return obs;
    })
    .subscribe(new MyObserver('info'))
})


let $flatMap = document.getElementById('flat-map');
$flatMap.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', '#ffc107', 3, 1000, 0, 'ObsA', desc1);

  clean();
  circleBlue$.getObservable(desc1)
    .flatMap((stamp) => {
      let scmO = new ScmObservable('X', 'blue', 4, 100 * stamp.index, 0, `swi${letterByIndex(stamp.index)}`, `generate flat observable ${letterByIndex(stamp.index)} `);
      let obs = scmO.getObservable('');
      return obs;
    })
    .subscribe(new MyObserver('info'))
})

let $takeUntil = document.getElementById('take-until');
$takeUntil.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', desc1);
  let xBlack3$ = new ScmObservable('X', 'black', 4, 1000, 2500, 'ObsB', desc2);

  clean();
  circleBlue$.getObservable(desc1)
    .takeUntil(xBlack3$.getObservable(desc2))
    .subscribe(new MyObserver('info'))
})


let $debounceTime = document.getElementById('debounce-time');
$debounceTime.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0);
  clean();
  circleBlue$.getObservable('debounceTime')
    .debounceTime(2400)
    .subscribe(new MyObserver('info'))
})

let $concat = document.getElementById('concat');
$concat.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', 'concat first observable');
  let xBlack3$ = new ScmObservable('X', 'black', 3, 1000, 0, 'ObsB', 'concat first observable');
  clean();
  circleBlue$.getObservable('concat first observable')
    .concat(xBlack3$.getObservable('second'))
    .subscribe(new MyObserver('info'))
})

let $merge = document.getElementById('merge');
$merge.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('#', 'black', 10, 1000, 0, 'ObsA', 'merge first observable');
  let xBlack3$ = new ScmObservable('X', 'black', 5, 700, 0, 'ObsB', 'merge first observable');
  clean();
  circleBlue$.getObservable('merge first observable')
    .merge(xBlack3$.getObservable('merge second Observable'))
    .subscribe(new MyObserver('info'))
})

let $combineLatest = document.getElementById('combine-latest');
$combineLatest.addEventListener('click', () => {
  let circleBlue$ = new ScmObservable('num', 'red', 5, 1200, 0, 'ObsA', 'combineLatest first observable');
  let xBlack3$ = new ScmObservable('alpha', 'black', 8, 700, 0, 'ObsB', 'combineLatest first observable');
  clean();
  circleBlue$.getObservable('combineLatest first observable')
    .combineLatest(xBlack3$.getObservable('combineLatest second Observable'))
    .subscribe(new MyObserver('info'))
})


let clean = () => {
  if (currentObservable) {
    currentObservable.unsubscribe();
    currentObservable = null;
  }
}

console.log('main ts ');


function randomLetter() {
  let letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return letter.toUpperCase();
}

function letterByIndex(index: number = 1) {
  let letter = String.fromCharCode(96 + index);
  return letter.toUpperCase();
}

let names = ['nico', 'sebas', 'juli', 'ana'];

// rest operator
let [fisrt, second, ...rest] = names;

rest.forEach(name => controlLog(name))

for (let x of rest) {
  controlLog(x);
}


// spread operator
let moreNames = ['gil', ...names];
for (let nam of moreNames) { //iterables
  controlLog(name);
}

for (let idx in moreNames) {
  controlLog(idx, moreNames[idx]);
}

interface IZone {
  city?: string
}

interface IAdress {
  street1: string
  street2?: string
  zone: IZone
}

let myAdress: IAdress = {
  street1: '7012',
  zone: {
    city: 'NY'
  }
}

//destructuring

let {street1: st1, street2: st2 = 'no data' } = myAdress;

controlLog(st1, st2);

/*
//no destructuring for objects , solo en babel stage 2
let x= {...myAdress}
*/

// deep destructuring

let {zone: {city}, street1} = myAdress;
controlLog(city);

function shortAdress({zone: {city}, street1}) {
  return {
    city,
    street1
  }
}

controlLog(shortAdress(<any>myAdress));

let controlLogEnabled = true;
function controlLog(data: any, ...rest) {
  if (controlLogEnabled)
    console.log(data, rest);
}

class Car {
  constructor(private color: string) { }

  getColor() {
    return this.color;
  }
}

class Supercar extends Car {
  constructor(private cc: number, color: string) {
    super(color)
  }

  getCc() {
    return this.cc;
  }
}


let ferrari = new Supercar(3000, 'red')

controlLog(ferrari.getColor())