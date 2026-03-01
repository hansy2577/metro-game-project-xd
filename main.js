function makeLocalAnim(name,animScr,L) {
  for (var i = 0; i < L + 1; i++) {
    var thing = document.createElement("img");
    document.body.appendChild(thing);
    
    thing.style.position = "absolute";
    thing.style.visibility = "hidden"
    thing.style.zindex = "0";
    thing.src = animScr + i + ".png";
    thing.style.backgroundColor = "black";
    thing.id = name + i;
    console.log(name + i + " | "+L+" create")
  }
}

function playLocalAnim(name,L,speed) {
  var localAnimValue = {
    i: 0,
    i2: 0,
    i3:0,
    L2: L + 1
  };
  
  setInterval(() => {
    if (localAnimValue.i2 == 0) {
      /*document.getElementById(name + localAnimValue.i).style.zindex = "5px";
      document.getElementById(name + localAnimValue.i).style.opacity = 0.5;*/
      document.getElementById(name + localAnimValue.i).style.visibility = "visible"


      localAnimValue.i2 = 1;
    } else {
      /*document.getElementById(name + localAnimValue.i).style.zindex = "0"
      document.getElementById(name + localAnimValue.i).style.opacity = 1;*/
      document.getElementById(name + localAnimValue.i).style.visibility = "hidden"

      localAnimValue.i2 = 0;
      localAnimValue.i ++;
      localAnimValue.i3 = localAnimValue.i + 1;

      
    }
    
    
    if (localAnimValue.i >= L) {
      localAnimValue.i = 0;
      localAnimValue.i2 = 0;
      localAnimValue.i3 = 1;
      document.getElementById(name + localAnimValue.i).style.visibility = "visible";
    } else {
      console.log("j")
      document.getElementById(name + localAnimValue.i).style.visibility = "visible";
    }
    console.log(localAnimValue.i,document.getElementById(name + localAnimValue.i).style.zindex)

  },speed)
}

makeLocalAnim("yo","M",4)

document.onclick = function () {
  playLocalAnim("yo",5,100)
}
// omg it fanilly work yaaaaz !!!!!!!!