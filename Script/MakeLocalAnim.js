// script create an animation using only inserted images. 

function makeLocalAnim(name,animScr,animLength) {
  for (var i = 0; i < animLength + 1; i++) {
    var thing = document.createElement("img"); // or document.getElementById(custom document id here).createElement("img");
    //                                   ↑ it can be a ("a") for text
    document.body.appendChild(thing);

    // custom setting
    thing.style.position = "absolute"; // or if you want a precise position ⟨ .left = "0px"; ⟩
    thing.style.zindex = "0";
    thing.style.backgroundColor = "black";

    // do not modify 
    thing.id = name + i;
    thing.style.visibility = "hidden";
    thing.src = animScr + i + ".png";
    
    console.log(name + i + " | "+L+" create")
  }
}

function playLocalAnim(name,animLength,speed) {
  var localAnimValue = {
    i: 0,
    i2: 0,
    i3:0,
    L2: animLength + 1
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
    
    
    if (localAnimValue.i >= animLength) {
      localAnimValue.i = 0;
      localAnimValue.i2 = 0;
      localAnimValue.i3 = 1;
      document.getElementById(name + localAnimValue.i).style.visibility = "visible";
    } else {
      //console.log("j")
      document.getElementById(name + localAnimValue.i).style.visibility = "visible";
    }
    //console.log(localAnimValue.i,document.getElementById(name + localAnimValue.i).style.zindex)
  },speed)
}

makeLocalAnim("test","myImage",4); 
playLocalAnim("test",5,100)
