// const app = {
//   lang: 'ko',
//   value: 100,
//   getNumber() {
//     return this.value;
//   },
//   updateNumber(value) {
//     this.value = value;
//   }
// }
//
// let number = app.getNumber();
// console.log(number);
//
// app.updateNumber(1000);
// number = app.getNumber();
// console.log(number);

const APP = {
  init() {
    this.layout()
    this.addEvent()
    this.reset()
  },
  layout() {
    this.navEl = document.querySelector('#global-navigation')
    this.biEl = document.querySelector('#bi')
  },
  addEvent() {
    this.biEl.addEventListener('click', this.handleClickBiEl)
    this.navEl.addEventListener('click', this.handleClickNavEl.bind(this))
    window.addEventListener('resize', this.handleResizeWindow.bind(this))
    window.addEventListener('scroll', this.handleScrollWindow.bind(this))
  },
  removeEvent() {
    this.biEl.removeEventListener('click')
    window.removeEventListener('resize')
    window.removeEventListener('scroll')
  },
  reset() {
    // dispatch > 이벤트 add 후 유저의 행위없이도 시스템에서 강제로 실행
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('scroll'))
  },
  handleClickNavEl() {
    console.log('navigation')
  },
  handleClickBiEl(e) {
    e.preventDefault() // 요소의 기본 이벤트 발생되지 않도록 방지
    e.stopPropagation()  // 부모요소의 이벤트 버블링 방지
    // bind(this)로 this를 받고 있을 경우 > APP 자체를 바인딩 받음
    // bind(this)가 없을 경우 this > event가 발생하는 주체
    console.log('click')
  },
  handleResizeWindow() {
    const { innerHeight: height, innerWidth: width } = window
    console.log('resize!!', { width, height })
  },
  handleScrollWindow() {
    const { scrollY: posY } = window
    console.log('scroll!!', posY)
  }
}

APP.init()
