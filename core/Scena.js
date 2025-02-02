import { keyboard } from './io/Keyboard.js'
import GameLoop from './GameLoop.js'

export default class Scena {
  constructor(manager, { autostart = false, usePointerLock = false } = {}) {
    this.manager = manager
    this.predmeti = []
    this.gameLoop = new GameLoop(this.loop, autostart, usePointerLock)
    this.handleClick = this.handleClick.bind(this)
    this.elementUI = document.getElementById('ui')
    this.prozorElement = document.getElementById('prozor')
    this.upamcenUI = this.upamcenProzor = this.zavrsniTekst = ''
    this.hocuVan = false
    document.addEventListener('click', this.handleClick)
  }

  init() {}

  dodaj(...predmeti) {
    this.predmeti.push(...predmeti)
  }

  /* VELIČINA */

  get sirina() {
    return window.innerWidth
  }

  get visina() {
    return window.innerHeight
  }

  /* UI */

  handleClick(e) {
    if (e.target.id == 'igraj-opet')
      this.manager.start(this.constructor.name)

    if (e.target.id == 'menu')
      this.manager.start('GlavniMeni')

    if (e.target.id == 'cancel')
      this.nastaviIgru()
  }

  napustiIgru() {
    return /* html */`
      <div class="prozorce centar">
        <p>Napusti igru?</p>
        <button id="menu">Da</button><button id="cancel">Ne</button><button id="igraj-opet">Igraj opet</button>
      </div>
    `
  }

  zavrsniProzor() {
    return /* html */`
      <div class="prozorce centar">
        <p>${this.zavrsniTekst}</p>
        <button id="igraj-opet">Igraj opet</button><button id="menu">Glavni meni</button>
      </div>
    `
  }

  prozor() {
    if (this.hocuVan) return this.napustiIgru()
    if (this.zavrsniTekst) return this.zavrsniProzor()
    return ''
  }

  zavrsi(text = 'Igra je završena.') {
    this.zavrsniTekst = text
    this.gameLoop.stopTime()
  }

  sablon() {
    return ''
  }

  #renderUI(t) {
    if (this.upamcenUI !== this.sablon(t)) {
      this.elementUI.innerHTML = this.sablon(t)
      this.upamcenUI = this.sablon(t)
    }
    if (this.upamcenProzor !== this.prozor()) {
      this.prozorElement.innerHTML = this.prozor()
      this.upamcenProzor = this.prozor()
    }
  }

  potvrdiIzlaz() {
    this.gameLoop.pause()
    this.hocuVan = true
  }

  nastaviIgru() {
    this.gameLoop.unpause()
    this.hocuVan = false
  }

  /* GLAVNA PETLJA */

  start() {
    this.gameLoop.start()
  }

  end() {
    this.gameLoop.stop()
    this.predmeti = []
    this.elementUI.innerHTML = this.prozorElement.innerHTML = ''
    document.removeEventListener('click', this.handleClick)
  }

  proveriTipke(dt) {
    if (this.zavrsniTekst) return

    if (keyboard.pressed.Escape) this.potvrdiIzlaz()

    this.predmeti.forEach(predmet => {
      if (predmet.ziv && predmet.proveriTipke) predmet.proveriTipke(dt)
    })
  }

  update(dt, t) {
    const rekurzivnoAzuriraj = predmet => {
      if (predmet.update) predmet.update(dt, t)
      if (predmet?.predmeti?.length) predmet.predmeti.forEach(rekurzivnoAzuriraj)
    }
    this.predmeti.forEach(rekurzivnoAzuriraj)
  }

  cisti() {}

  render() {}

  loop = (dt, t) => {
    this.proveriTipke(dt)
    this.update(dt, t)
    this.cisti()
    this.render(dt, t)
    this.#renderUI(t)
  }
}
