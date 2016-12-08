class Timer {
  constructor($timer, seconds) {
    this.$timer = $timer;
    this.seconds = seconds;
    this.renderTimer();
    this.interval = undefined;
  }

  renderTimer() {
    this.$timer.innerText = this.seconds;
  }

  reset(seconds) {
    this.seconds = seconds;
    this.renderTimer();
  }

  tick() {
    this.seconds--;
    this.renderTimer();
    if (this.seconds === 0) {
      window.clearInterval(this.interval);
    }
  }

  stop() {
    window.clearInterval(this.interval);
  }

  start() {
    this.interval = window.setInterval(this.tick.bind(this), 1000);
  }
}

export default Timer;