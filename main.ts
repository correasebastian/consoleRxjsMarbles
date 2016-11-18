import { Observable, Observer } from 'rxjs';
let numbers = [1, 5, 10, 15];
let source = Observable.from(numbers);

interface Istamp {
  color: string
  shape: string
  index: number
  secuence?: string
}
class MyObserver implements Observer<Istamp>{

  constructor(private log: string) { }
  next(stamp: Istamp) {
    // console[this.log](stamp);
    console.log(`%c${stamp.index}${stamp.secuence}${stamp.shape}`, `color: red; font-size:15px;`);
    // console.log(`%c${value.shape}(${value.index})`, `color: ${value.color}; font-size:30px;`);
  }

  error(e) {
    console.error(`error ${e}`)
  }

  complete() {
    console.info('completed')
  }
}


class ScmObservable {
  private observable: Observable<Istamp>;
  private index: number = 1;
  private secuence: string = ' ';

  constructor(private geometry: string = '.', private color: string = 'blue', private limit: number = 10, private interval: number = 1000) {
    console.log('constructor');

    this.observable = Observable.create(this.link)
      .do((stamp: Istamp) => {
        // console.log(`%c${stamp.shape}(${stamp.index})`, `color: ${stamp.color}; font-size:30px;`);
        // console.log(stamp.index);
        console.log(`%c${stamp.index}${stamp.secuence}${stamp.shape}`, `color: ${stamp.color}; font-size:15px;`);
      })
  }

  /* arrow fuction can capture this.. but not normal function for example like this

   link(){
     this.limit // no serviria
   }*/
  link = (observer: Observer<Istamp>) => {
    let interval = setInterval(() => {
      // console.log(index);
      if (this.index <= this.limit) {
        this.secuence += '- ';
        let st: Istamp = {
          color: this.color,
          shape: this.geometry,
          index: this.index,
          secuence: this.secuence
        }
        observer.next(st);
        // `${this.color} : ${this.geometry} : ${this.index}`
        this.index += 1;

      } else {
        observer.complete();
        clearInterval(interval);
      }
    }, this.interval)
  }

  getObservable() {
    return this.observable;
  }
}


var circleBlue$ = new ScmObservable('.', 'blue', 10, 1000);
var triangleRed$ = new ScmObservable('^', 'red', 10, 1000);

circleBlue$.getObservable()
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
  .take(5)
  .subscribe(new MyObserver('info'))
// triangleRed$.getObservable().subscribe(new MyObserver('error'))






console.log('main ts ');