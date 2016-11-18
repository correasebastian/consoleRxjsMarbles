import { Observable, Observer } from 'rxjs';
let numbers = [1, 5, 10, 15];
let source = Observable.from(numbers);

interface stamp{
  color:string
  shape:string
}
class MyObserver implements Observer<string>{

  constructor(private log:string){}
  next(value) {
    console[this.log](`${value}`);
    console.log("%c.", "color: blue; font-size:30px;");
  }

  error(e) {
    console.error(`error ${e}`)
  }

  complete() {
    console.info('completed')
  }
}

// source.subscribe(new MyObserver());


// Observable.create(observer => {

//   setInterval(() => {

//   }, 1000)
// })




class ScmObservable {
  private observable: Observable<string>;

  constructor(private geometry: string = 'circle', private color: string = 'blue', private limit: number = 10, private interval: number = 1000) {
    console.log('constructor');
    //   this.observable = Observable.create((observer: Observer<number>) =>{
    //   let index = 0;
    //   let interval = setInterval(() => {
    //      console.log(index, this.limit, this.interval);
    //     if (index <= this.limit) {

    //       observer.next(index);
    //       index +=1;
    //     } else {
    //       observer.complete();
    //     }
    //   }, this.interval)
    // })
    this.observable = Observable.create(this.link)
  }

  /* arrow fuction can capture this.. but not normal function for example like this

   link(){
     this.limit // no serviria
   }*/
  link = (observer: Observer<string>) => {
    let index = 0;
    let interval = setInterval(() => {
      // console.log(index);
      if (index <= this.limit) {

        observer.next(`${this.color} : ${this.geometry} : ${index}`);
        index += 1;
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


var circleBlue$ = new ScmObservable('circle', 'blue', 10, 1000);
var triangleRed$ = new ScmObservable('triangle', 'red', 10, 1000);

circleBlue$.getObservable().subscribe(new MyObserver('info'))
triangleRed$.getObservable().subscribe(new MyObserver('error'))






console.log('main ts ');