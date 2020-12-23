function Character(info) {
  this.mainElem = document.createElement('div');
  this.mainElem.classList.add('character');
  this.mainElem.innerHTML = ''
      + '<div class="character-face-con character-head">'
          + '<div class="character-face character-head-face face-front"></div>'
          + '<div class="character-face character-head-face face-back"></div>'
      + '</div>'
      + '<div class="character-face-con character-torso">'
          + '<div class="character-face character-torso-face face-front"></div>'
          + '<div class="character-face character-torso-face face-back"></div>'
      + '</div>'
      + '<div class="character-face-con character-arm character-arm-right">'
          + '<div class="character-face character-arm-face face-front"></div>'
          + '<div class="character-face character-arm-face face-back"></div>'
      + '</div>'
      + '<div class="character-face-con character-arm character-arm-left">'
          + '<div class="character-face character-arm-face face-front"></div>'
          + '<div class="character-face character-arm-face face-back"></div>'
      + '</div>'
      + '<div class="character-face-con character-leg character-leg-right">'
          + '<div class="character-face character-leg-face face-front"></div>'
          + '<div class="character-face character-leg-face face-back"></div>'
      + '</div>'
      + '<div class="character-face-con character-leg character-leg-left">'
          + '<div class="character-face character-leg-face face-front"></div>'
          + '<div class="character-face character-leg-face face-back"></div>'
      + '</div>';

  document.querySelector('.stage').appendChild(this.mainElem);

  this.mainElem.style.left = info.xPos + '%';
  // 스크롤 중인지 아닌지
  this.scrollState = false;
  // 바로 이전 스크롤 위치
  this.lastScrollTop = 0;
  this.xPos = info.xPos;
  this.speed = info.speed;
  this.direction;
  // 좌우 이동 중인지 아닌지
  this.runningState = false;
  this.rafId;
  this.init();
}

Character.prototype = {
  constructor: Character,
  init: function () {
      const self = this;

      // 현재 스크롤 상태를 나타내는 scrollState의 기본값은 false이다. 
  // 스크롤 이벤트가 실행되면 clearTimeout이 먼저 작동한다. 
  // clearTimeout은 setTimeout의 반환값을 매개변수로 하여 setTimeout을 취소시키는 함수이다. 
  // 지금은 setTimeout이 실행되지 않았으니 건너뛰고 다음 if문으로 가자. 
  // "!(self.scrollState=false)= true", 즉 if(true){} 이므로 if문이 실행된다. running 클래스가 붙어 이제 애니메이션이 작동된다. 
  // 다음으로 setTimeout 함수로 가보자. setTimeout은 항상 숫자를 리턴하기 때문에 scrollState는 값을 가지게 되어 true가 된다.
  // setTimeout 안의 내용들은 0.5초 후에 실행되는데 실행되기도 전에 스크롤 이벤트 갱신과 함께 clearTimeout으로 인해 실행되지 못한다.
  // 이제 if문으로 넘어가는데 scrollState가 true이므로 if(!true), 즉, if(false)가 되어 if 문이 실행되지 않는다.
  // 그리고 setTimeout으로 넘어가면 마찬가지로 리턴값을 받아 여전히 true이고, settimeout은 실행되지 않는다.
  // 이렇게 반복되다가 마지막 스크롤일 때 setTimeout이 드디어 실행된다. 
  // 왜냐하면 더 이상 스크롤 이벤트가 일어나지 않아 clearTimeout이 동작하지 않기 때문이다.
  // 비로소 scrollstate는 false가 되고 running 클래스는 제거된다.
      window.addEventListener('scroll', function () {
          clearTimeout(self.scrollState);

          if (!self.scrollState) {
              self.mainElem.classList.add('running');
          }

          self.scrollState = setTimeout(function () {
              self.scrollState = false;
              self.mainElem.classList.remove('running');
          }, 500);

          // 이전 스크롤 위치와 현재 스크롤 위치를 비교
          if (self.lastScrollTop > pageYOffset) {
              // 이전 스크롤 위치가 크다면: 스크롤 올림
              self.mainElem.setAttribute('data-direction', 'backward');
          } else {
              // 현재 스크롤 위치가 크다면: 스크롤 내림
              self.mainElem.setAttribute('data-direction', 'forward');
          }

          self.lastScrollTop = pageYOffset;
      });

      window.addEventListener('keydown', function (e) {
          if (self.runningState) return;

          if (e.keyCode == 37) {
              // 왼쪽
              self.direction = 'left';
              self.mainElem.setAttribute('data-direction', 'left');
              self.mainElem.classList.add('running');
              self.run(self);
              // self.run(); // bind를 사용한 방법
              self.runningState = true;
          } else if (e.keyCode == 39) {
              // 오른쪽
              self.direction = 'right';
              self.mainElem.setAttribute('data-direction', 'right');
              self.mainElem.classList.add('running');
              self.run(self);
              // self.run(); // bind를 사용한 방법
              self.runningState = true;
          }
      });

      window.addEventListener('keyup', function (e) {
          self.mainElem.classList.remove('running');
          cancelAnimationFrame(self.rafId);
          self.runningState = false;
      });
  },
  run: function (self) {
      if (self.direction == 'left') {
          self.xPos -= self.speed;
      } else if (self.direction == 'right') {
          self.xPos += self.speed;
      }

      if (self.xPos < 2) {
          self.xPos = 2;
      }

      if (self.xPos > 88) {
          self.xPos = 88;
      }

      self.mainElem.style.left = self.xPos + '%';

      self.rafId = requestAnimationFrame(function () {
          self.run(self);
      });
  }
  // bind를 사용한 방법
  // run: function () {
  //     const self = this;
  //
  //     if (self.direction == 'left') {
  //         self.xPos -= self.speed;
  //     } else if (self.direction == 'right') {
  //         self.xPos += self.speed;
  //     }
  //
  //     if (self.xPos < 2) {
  //         self.xPos = 2;
  //     }
  //
  //     if (self.xPos > 88) {
  //         self.xPos = 88;
  //     }
  //
  //     self.mainElem.style.left = self.xPos + '%';
  //
  //     self.rafId = requestAnimationFrame(self.run.bind(self));
  // }
};
