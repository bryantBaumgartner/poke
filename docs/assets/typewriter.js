var i = 0;
var txt = "Programming, It's What I Do"
var speed = 50;

function typeWriter() {
  if (i < txt.length) {
    if (document.getElementById("type") != null) {
      document.getElementById("type").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
}