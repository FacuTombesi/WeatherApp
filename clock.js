function updateClock() {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  document.getElementById("clock").textContent = `${hours}:${minutes}`
}

function startClock() {
  updateClock()
  setInterval(updateClock, 1000)
}

startClock()