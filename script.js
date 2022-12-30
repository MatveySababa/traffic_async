"use strict";

let background = document.querySelector(".background")
background.style.height = document.documentElement.clientHeight + "px"; // растянуть цвет на весь экран, а можно в CSS через height: 100vh 

let trafficElem = document.querySelector(".traffic-light"); // находим div с цветами

let trafficLight = {  // создаём объект цветов светофора
  elem: trafficElem,
  redLight: trafficElem.querySelector(".red"),
  yellowLight: trafficElem.querySelector(".yellow"),
  greenLight: trafficElem.querySelector(".green"),
  
  redTime: 5000,
  yellowTime: 1000,
  greenTime: 4000,
  
  
/* первый вариант записи:

! адская пирамида колбэков :)

  startWorking() {
    this.turnRed();
    setTimeout(() => {          //* функция-callback
      this.turnYellow();
      setTimeout(() => {
        this.turnGreen();
        setTimeout(() => {
          this.turnYellow();
          setTimeout(() => {
            this.startWorking();
          },this.yellowTime)
        },this.greenTime)
      },this.yellowTime)
    },this.redTime)          */
    
// второй вариант записи:

  startWorking() {
    this.turnRed()
      .then(() => {return this.turnYellow()})
      .then(() => this.turnGreen())
      .then(() => this.turnYellow())
      .then(() => this.startWorking());
  },
  
// третий вариант записи:

  startWorking2: async function() { // async (ключевое слово) - асинхронная функция, выполняется вне основного треда
    await this.turnRed();  // await останавливает выполнение кода пока не будет выполнен Promise после этого слова
    await this.turnYellow();
    await this.turnGreen();
    let result = await this.turnYellow();
    this.startWorking();
    console.log(result);
  },
  
  turnRed() {
    return new Promise((resolve, reject) => {
      this.redLight.style.backgroundColor = "#FF0000";
      this.yellowLight.style.backgroundColor = "black";
      this.greenLight.style.backgroundColor = "black";
      setTimeout(() => {return resolve()}, this.redTime);   // длинная запись
      
                            // генерация пользовательского события
      this.redLight.dispatchEvent(new CustomEvent("turnedRed", {  // dispatch - отправление пользовательского события
        bubbles: true,  // всплывающее событие (bubbles) отрабатывает везде
      }));
    })
  },
  
  turnYellow() {
    return new Promise((resolve, reject) => {
      this.redLight.style.backgroundColor = "black";
      this.yellowLight.style.backgroundColor = "#FF5F00";
      this.greenLight.style.backgroundColor = "black";
      setTimeout(() => resolve(), this.yellowTime);         // укороченная запись
    })  
  },
  
  turnGreen() {
    return new Promise((res, rej) => {                      // короткая запись
      this.redLight.style.backgroundColor = "black";
      this.yellowLight.style.backgroundColor = "black";
      this.greenLight.style.backgroundColor = "#00C618";
      setTimeout(() => res(), this.greenTime);              // короткая запись
      
                             // генерация пользовательского события
      this.greenLight.dispatchEvent(new CustomEvent("turnedGreen", {  // dispatch - отправление пользовательского события
        bubbles: true,  // всплывающее событие (bubbles) отрабатывает везде
      }));
    })  
  },
}

trafficLight.startWorking();

//* promise - обещание

/*
function f() {
  return new Promise((resolve, reject) => { //* обязательные методы promise
                                            //!  resolve() - разрешить (проблему), можно сократить до res
                                            //!  reject() - отказать (сбросить), можно сократить до rej
    console.log("Промис начал работу")
    setTimeout(() => {
      resolve();
    }, 2000)
    setTimeout(() => {
      reject();
    }, 1000)
/*  if (!data) {        //* такая запись при передаче данных (data)
      reject();
    } 
  });
}

f()
  .then(() => {console.log("Промис отработал")})               // .then (ключевое слово), чтобы поймать resolve
  .catch(() => {console.error("Промис завершился с ошибкой")}) // .catch (ключевое слово), чтобы поймать reject
  

function carMove() {
  return new Promise((resolve, reject) => {
    let car = document.querySelector(".car");
    car.style.left = 0;
    car.style.transition = "left 5s linear";
    setTimeout(() => {
      car.style.left = "1000px";
    }, 100)
    car.ontransitionend = () => {
      resolve();
    }
  });
}

carMove()
  .then(() => console.log("Машина доехала"));   */


// домашнее задание :

/*let car = {
  elem: document.querySelector(".car");
  leftPos: 0,
  
  rideRight() {
    return new Promise((resolve, reject) => {
      car.elem.style.left = 0;
      car.elem.style.transition = "left 5s linear";
      setTimeout(() => {
        car.elem.style.left = 'calc(100vw - 300px)';
      }, 10)
      car.elem.ontransitionend = () => {
        resolve
      }
  }
  
}*/

// цикл движения машины:

let car = {
  elem: document.querySelector(".car"),
  animationId: null,
  leftPos: 0,                          // позиция с которой начинается анимация
  
  drive() {
    car.animationId = requestAnimationFrame(function measure() { // measure - значение на которое должно измениться
      car.leftPos += 3;                                           // скорость движения машины   
      car.elem.style.left = car.leftPos + "px";
      // if(car.leftPos > document.documentElement.clientWidth) {} // если уезжает за ширину документа, то car.leftPos = -300; 
      
      if(car.leftPos > background.getBoundingClientRect().width) { // если уезжает за ширину бекграунда,
        car.leftPos = -300;                                        // то вернуться на -300 слева экрана
      }
      
      car.animationId = requestAnimationFrame(measure);
    })
  },
  
  stop() {
    cancelAnimationFrame(car.animationId);
  },
  
}  

document.addEventListener("turnedGreen", () => {  // через метод слушания событий реализуем пользовательское событие
  car.drive();
})

document.addEventListener("turnedRed", () => {
  car.stop();
})























