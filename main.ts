import { Observable, Observer } from 'rxjs';
let numbers = [1, 5, 10, 15];
let source = Observable.from(numbers);

interface Istamp {
  color: string
  shape: string
  index:number
}
class MyObserver implements Observer<Istamp>{

  constructor(private log: string) { }
  next(value: Istamp) {
    // console[this.log](value);
    console.log(`%c${value.shape}(${value.index})`, `color: ${value.color}; font-size:30px;`);
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
  private index:number=0;

  constructor(private geometry: string = '.', private color: string = 'blue', private limit: number = 10, private interval: number = 1000) {
    console.log('constructor');

    this.observable = Observable.create(this.link)
    .do((stamp:Istamp)=>{
      console.log(`%c${stamp.shape}(${stamp.index})`, `color: ${stamp.color}; font-size:30px;`);
    })
  }

  /* arrow fuction can capture this.. but not normal function for example like this

   link(){
     this.limit // no serviria
   }*/
  link = (observer: Observer<Istamp>) => {
    // let index = 0;
    let interval = setInterval(() => {
      // console.log(index);
      if (this.index <= this.limit) {
        let st: Istamp = {
          color: this.color,
          shape: this.geometry,
          index:this.index
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

circleBlue$.getObservable().subscribe(new MyObserver('info'))
triangleRed$.getObservable().subscribe(new MyObserver('error'))






console.log('main ts ');