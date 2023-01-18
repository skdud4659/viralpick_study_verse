const MODE = ['light', 'dark', 'red', 'green']

const APP = {
  _mode: 'light',
  init() {
    this.layout()
    this.addEvent()
    this.reset()
  },
  layout() {
    this.modeNameEl = document.querySelector('#mode-name')
    this.btnModeMenuEls = document.querySelectorAll('#mode-menu li')
  },
  addEvent() {
    this.btnModeMenuEls.forEach((el, idx) => {
      el.addEventListener('click', this.handleClickMode.bind(this))
    })
  },
  handleClickMode(e) {
    e.preventDefault()
    const elTarget = e.currentTarget
    if (elTarget.classList.contains('selected')) {
      return
    }
    const mode = elTarget.children[0].className
    if (this._mode !== mode) {
      this.btnModeMenuEls.forEach((el) => {
        if (el.classList.contains('selected')) {
          el.classList.remove('selected')
        }
        elTarget.classList.add('selected')
      })
      this.setMode(mode)
    }
  },
  reset() {
    const { documentElement: htmlEl } = document
    htmlEl.classList.add(`mode-${MODE[0]}`)
    this.modeNameEl.innerHTML = this._mode
  },
  setMode(modeTarget) {
    const { documentElement: htmlEl } = document
    MODE.forEach((mode) => {
      htmlEl.classList.remove(`mode-${mode}`)
    })
    this._mode = modeTarget
    htmlEl.classList.add(`mode-${this._mode}`)
    this.modeNameEl.innerHTML = this._mode
  }
}

APP.init()
