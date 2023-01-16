const APP = {
  _cuId: 0,
  _exId: null,
  init() {
    this.layout()
    this.addEvent()
    this.reset()
  },
  layout() {
    this.tabMenuEls = document.querySelectorAll('#tab-menu li a')
    this.tabContentEls = document.querySelectorAll('#tab-content .tab-content')

  },
  addEvent() {
    // for (let i = 0; i < this.tabMenuEls.length; i ++) {
    //   this.tabMenuEls[i].addEventListener('click', this.handleClickTab)
    // }
    this.tabMenuEls.forEach((el, idx) => {
      el.addEventListener('click', this.handleClickTabMenuEl.bind(this))
    })
  },
  reset() {
    this._cuId = 0
    // 이전에 선택된 id를 체크
    this._exId = this._cuId
  },
  handleClickTabMenuEl(e) {
    e.preventDefault()
    const el = e.currentTarget
    if (el.classList.contains('selected')) {
      // selected 클래스가 a 요소에 포함이 되어있다면 이미 선택된 콘텐츠.
      return
    }
    const tabMenuEls = Array.prototype.slice.call(this.tabMenuEls)
    const idx = tabMenuEls.indexOf(el)
    if (!el.classList.contains('selected')) {
      if (this._exId !== null) {
        this.tabMenuEls[this._exId].classList.remove('selected')
        this.tabContentEls[this._exId].classList.remove('selected')
      }
      // 새로운 Id를 적용하고 노출시킬 콘텐츠에 selected 클래스 추가.
      this._cuId = idx
      this.tabMenuEls[this._cuId].classList.add('selected')
      this.tabContentEls[this._cuId].classList.add('selected')
      // == animation ==
      // 클래스 적용이 완료된 이후 마지막 부분에서 이전에 선택한 아이템이 뭔지 체크해두는 용도.
      this._exId = this._cuId
    }
  }
}

APP.init()
