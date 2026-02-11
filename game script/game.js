// make let object

let chose_train = localStorage.getItem("train select");
let chose_maps = localStorage.getItem("map select");
let chose_ligne = localStorage.getItem("ligne select");

// load map path

let json_map = "assets/Maps/"+chose_maps+"/main.json";
let json_map_link = "assets/Maps/"+chose_maps+"/";
get_maps_json(json_map)

// load ligne path

let json_ligne = "assets/Lignes/"+chose_ligne+".json";
get_ligne_json(json_ligne)

// load train path

let json_train = "assets/Trains/"+chose_train+"/main.json";
let json_train_link = "assets/Trains/"+chose_train+"/";
get_train_json(json_train)

// other let ( var ) thing

let train = {
  tension_up: false,
  tension_dows: false,
  show_speed: 120,
  speed: 0,
  speed2: 0, // inversed
  traction_speed:null,
  
  door: {
    value: 1,
    on: false
  },
  
  power: "on",
  AWS: {
    on: false
  }
  
}

let game = {
  meter: 0,
  mini_map:true,
  
  popup1: {
    warning: false,
    speed_limit: 120
  },
  
  station: {
    next_station: null,
    next_station_distance: null,
  }
}

let loop1;
let reset_loop1 = false;

let BG = null;
let BG_anim = null;
let BG_max_anim = null;

let light = null;
let light_anim = null;
let light_max_anim = null;

let train_passing = null;
let train_passing_anim = null;
let train_passing_max_anim = null;
let train_passing_interval = null;
var k = 0;

// get main.json in train path

function get_train_json(link) {
  // get the json file
  var rawFile = new XMLHttpRequest();
  var reload = 0;
  rawFile.open("get", link, true);
  rawFile.onreadystatechange = function() {
    reload++;
    if (rawFile.readyState === 4) {
      var allText = rawFile.responseText;
    }
    if (reload == 3) {
      
      if (allText == "Error 404, file not found.") {
        error("error ! | sorry no train asset found")
      } else {
        json_train = JSON.parse(allText);
        
        train.traction_speed = json_train["train option"].speed * 100;
        train.power = json_train["train option"]["power on?"]
        
        loop2()
        train_element()
      }
    }
  }
  rawFile.send();
}

function get_maps_json(link) {
    // get the json file
  var rawFile = new XMLHttpRequest();
  var reload = 0;
  rawFile.open("get",link, true);
  rawFile.onreadystatechange = function() {
    reload++;
    if (rawFile.readyState === 4) {
      var allText = rawFile.responseText;
    }
    if (reload == 3 ) {
      
      if (allText == "Error 404, file not found.") {
        error("error ! | sorry no maps asset found")
      } else {
        json_map = JSON.parse(allText);
        maps_element()
      }
    }
  }
  rawFile.send();
}

function get_ligne_json(link) {
    // get the json file
  var rawFile = new XMLHttpRequest();
  var reload = 0;
  rawFile.open("get",link, true);
  rawFile.onreadystatechange = function() {
    reload++;
    if (rawFile.readyState === 4) {
      var allText = rawFile.responseText;
    }
    if (reload == 3 ) {
      
      if (allText == "Error 404, file not found.") {
        error("error ! | sorry no ligne asset found")
      } else {
        json_ligne = JSON.parse(allText);
        loop3()
      }
    }
  }
  rawFile.send();
}

// load thing like sound 

document.onclick = function() {
  if (k <= 0) {
    k++;
    interact_load()
  }
}

// #loading screen 

var loading = document.createElement('img');
document.body.appendChild(loading);
loading.style.position = "absolute";
loading.src = "images/loading1.gif";
loading.style.left = "-50px"
loading.style.top = "0px"
loading.style.zIndex = "5"

var B = Math.random() * 900;
var A = 0;
var C = 1;
B + 2500;
var looop = setInterval(function() {
  A++;
  // console.log(A + "/"+ B + "/" + C)
  if (A >= B) {
    if (C <= 0.1) {
      clearInterval(looop);
      loading.remove();
      console.clear();
      onloading_end();
    }
    C -= 0.04;
    loading.style.opacity = C;
  }
}, 1)

// all asset ( yep )

function train_element() {

  for (var i = 0; i < json_train["body"]["body"].length; i++) {
    var body1 = document.createElement("img")
    document.getElementById("train element").appendChild(body1);
    
    var id = json_train["body"]["body"][i];
    console.log(id[0]+" add")
    body1.style.position = "absolute";
    body1.src = json_train_link + id[0] + ".png";
    body1.style.left = id[1] + "px";
    body1.style.top = id[2] + "px";
    body1.style.zIndex = "0";
    body1.style.scale = id[3];
    body1.onclick = function() {
      
    }
  }

  if (json_train.body.button["pre-closing doors"] !== false) {
    let doors4 = document.createElement("img")
    document.getElementById("train element").appendChild(doors4);
    
    var id = json_train.body.button["pre-closing doors"]
    console.log(id[0]+" add")
    doors4.style.position = "absolute";
    doors4.src = json_train_link + id[0] + ".png";
    doors4.style.left = id[1] + "px";
    doors4.style.top = id[2] + "px";
    doors4.style.zIndex = "0";
    doors4.style.scale = id[3];
    doors4.onclick = function() {
      button_click()
    }
  }

  if (json_train.body.button["tension up"] !== false) {
    let tensionup = document.createElement("img")
    document.getElementById("train element").appendChild(tensionup);
    
    
    var id = json_train.body.button["tension up"]
    console.log(id[0] + " add")
    tensionup.style.position = "absolute";
    tensionup.src = json_train_link + id[0] + ".png";
    tensionup.style.left = id[1] + "px";
    tensionup.style.top = id[2] + "px";
    tensionup.style.zIndex = "0";
    tensionup.style.scale = id[3];
    tensionup.onclick = function() {
      button_click()
      if (train.tension_up == false && train.power == true) {
        train.tension_up = true;
        tensionup.style.opacity = 0.5
      } else {
        train.tension_up = false;
        tensionup.style.opacity = 1
      }
    }
  }
  
  if (json_train.body.button["tension dows"] !== false) {
    let tensiondows = document.createElement("img")
    document.getElementById("train element").appendChild(tensiondows);
    
    
    var id = json_train.body.button["tension dows"]
    console.log(id[0]+" add")
    tensiondows.style.position = "absolute";
    tensiondows.src = json_train_link + id[0] + ".png";
    tensiondows.style.left = id[1] + "px";
    tensiondows.style.top = id[2] + "px";
    tensiondows.style.zIndex = "0";
    tensiondows.style.scale = id[3];
    tensiondows.onclick = function() {
      button_click()
      if (train.tension_dows == false) {
        train.tension_dows = true;
        tensiondows.style.opacity = 0.5
      } else {
        train.tension_dows = false;
        tensiondows.style.opacity = 1
      }
    }
  }
  
  if (json_train.body.button["horn1"] !== false) {
    let horn1 = document.createElement("img")
    document.getElementById("train element").appendChild(horn1);
    
    var id = json_train.body.button["horn1"]
    console.log(id[0]+" add")
    horn1.style.position = "absolute";
    horn1.src = json_train_link + id[0] + ".png";
    horn1.style.left = id[1] + "px";
    horn1.style.top = id[2] + "px";
    horn1.style.zIndex = "0";
    horn1.style.scale = id[3];
    horn1.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body.button["horn2"] !== false) {
    let horn2 = document.createElement("img")
    document.getElementById("train element").appendChild(horn2);
    
    var id = json_train.body.button["horn2"]
    console.log(id[0]+" add")
    horn2.style.position = "absolute";
    horn2.src = json_train_link + id[0] + ".png";
    horn2.style.left = id[1] + "px";
    horn2.style.top = id[2] + "px";
    horn2.style.zIndex = "0";
    horn2.style.scale = id[3];
    horn2.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body.button["doors open/close"][0] !== false) {
    let door1 = document.createElement("img")
    document.getElementById("train element").appendChild(door1);
    
    var id2 = json_train.body.button["doors open/close"][0]
    console.log(id2[0]+" add")
    door1.style.position = "absolute";
    door1.src = json_train_link + id2[0] + ".png";
    door1.style.left = id2[1] + "px";
    door1.style.top = id2[2] + "px";
    door1.style.zIndex = "0";
    door1.style.scale = id2[3];
    door1["id"] = "button_opendoors"
    door1.onclick = function() {
      button_click()
      
      if (train.speed <= 1) {
        doors("open");
      }
    }
  }
  
  if (json_train.body.button["doors open/close"][1] !== false) {
    let door2 = document.createElement("img")
    document.getElementById("train element").appendChild(door2);
    
    var id2 = json_train.body.button["doors open/close"][1]
    console.log(id2[0]+" add")
    door2["id"] = "button_closedoors";
    door2.style.position = "absolute";
    door2.src = json_train_link + id2[0] + ".png";
    door2.style.left = id2[1] + "px";
    door2.style.top = id2[2] + "px";
    door2.style.zIndex = "0";
    door2.style.scale = id2[3];
  
    door2.onclick = function() {
      button_click()
      
      doors("close");
    }
  }
  
  if (json_train.body.button["light1"] !== false) {
    let light1 = document.createElement("img")
    document.getElementById("train element").appendChild(light1);
    
    var id = json_train.body.button["light1"]
    console.log(id[0]+" add")
    light1.style.position = "absolute";
    light1.src = json_train_link + id[0] + ".png";
    light1.style.left = id[1] + "px";
    light1.style.top = id[2] + "px";
    light1.style.zIndex = "0";
    light1.style.scale = id[3];
    light1.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body.button["light2"] !== false) {
    let light2 = document.createElement("img")
    document.getElementById("train element").appendChild(light2);
    
    var id = json_train.body.button["light2"]
    console.log(id[0]+" add")
    light2.style.position = "absolute";
    light2.src = json_train_link + id[0] + ".png";
    light2.style.left = id[1] + "px";
    light2.style.top = id[2] + "px";
    light2.style.zIndex = "0";
    light2.style.scale = id[3];
    light2.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body.button["light3"] !== false) {
    let light3 = document.createElement("img")
    document.getElementById("train element").appendChild(light3);
    
    var id = json_train.body.button["light3"]
    console.log(id[0]+" add")
    light3.style.position = "absolute";
    light3.src = json_train_link + id[0] + ".png";
    light3.style.left = id[1] + "px";
    light3.style.top = id[2] + "px";
    light3.style.scale = id[3];
    light3.style.zIndex = "0";
    light3.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body.button["interior light"] !== false) {
    let interior_light = document.createElement("img")
    document.getElementById("train element").appendChild(interior_light);
    
    var id = json_train.body.button["interior light"]
    console.log(id[0] + " add")
    interior_light.style.position = "absolute";
    interior_light.src = json_train_link + id[0] + ".png";
    interior_light.style.left = id[1] + "px";
    interior_light.style.top = id[2] + "px";
    interior_light.style.scale = id[3];
    interior_light.style.zIndex = "0";
    interior_light.onclick = function() {
      button_click()
    }
  }
  
  if (json_train.body["speed counter"] !== false) {
    let guispeed = document.createElement("a")
    document.getElementById("train element").appendChild(guispeed);
    
    var id = json_train.body["speed counter"];
    console.log("speed counter" + " add")
    guispeed.style.position = "absolute";
    guispeed.style.left = id[1].x + "px";
    guispeed.style.top = id[1].y + "px";
    guispeed.style.scale = id[1].scale;
    guispeed.innerText = "50 km/h";
    guispeed.style.color = "white"
    guispeed.style.backgroundColor = "black"
    guispeed.style.zIndex = "2";
    guispeed.id = "guispeed";
  }
  
  if (json_train.body.button["AWS"] !== false) {
    let AWS = document.createElement("img")
    document.getElementById("train element").appendChild(AWS);
    
    var id = json_train.body.button["AWS"]
    console.log(id[0]+" add")
    AWS.style.position = "absolute";
    AWS.src = json_train_link + id[0] + ".png";
    AWS.style.left = id[1].x + "px";
    AWS.style.top = id[1].y + "px";
    AWS.style.scale = id[1].scale;
    AWS.style.zIndex = "0";
    AWS.id = "aws";
    AWS.onclick = function() {
      button_click()
      if (train.speed <= game.popup1.speed_limit + 4) {
        train.AWS.on = false;
        document.getElementById("aws").style.filter = "brightness("+100+"%)";
      }
    }
  }
}

function maps_element() {

  if (json_map["body"]["body"] !== false) {
    BG = document.createElement("img")
    BG_anim = json_map["body"]["body"][0];
    BG_max_anim = json_map["body"]["body"][1];
    
    document.getElementById("maps element").appendChild(BG);
    
    var id = json_map["body"]["body"]
    console.log(id[0] + " add")
    BG.style.position = "absolute";
    BG.src = json_train_link + id[0] + ".png";
    BG.style.left = id[2].xyz[0] + "px";
    BG.style.top = id[2].xyz[1] + "px";
    BG.style.zIndex = "-1";
    BG.style.scale = id[2].xyz[2];
    BG.src = json_map_link + BG_anim + 0 + ".png";
  }
  
  if (json_map["body"]["body"][3]["train passing"] !== false) {
    train_passing = document.createElement("img")
    train_passing_anim = json_map["body"]["body"][3]["train passing"][0][0];
    train_passing_max_anim = json_map["body"]["body"][3]["train passing"][0][1];
    train_passing_interval = json_map["body"]["body"][3]["train passing"][0][2];
    
    document.getElementById("maps element").appendChild(train_passing);
    
    var id = json_map["body"]["body"][3]["train passing"][0]
    console.log(id[0] + " add")
    train_passing.style.position = "absolute";
    train_passing.src = json_train_link + id[0] + ".png";
    train_passing.style.left = id[3].xyz[0] + "px";
    train_passing.style.top = id[3].xyz[1] + "px";
    train_passing.style.zIndex = "0";
    train_passing.style.scale = id[3].xyz[2];
    train_passing.src = json_map_link + train_passing_anim + train_passing_max_anim + ".png";
  }
  
  if (json_map["body"]["body"][3]["light"] !== false) {
    light = document.createElement("img")
    light_anim = json_map["body"]["body"][3]["light"][0];
    light_max_anim = json_map["body"]["body"][3]["light"][1];
    
    document.getElementById("maps element").appendChild(light);
    
    var id = json_map["body"]["body"][3]["light"]
    console.log(id[0] + " add")
    light.style.position = "absolute";
    light.src = json_train_link + id[0] + ".png";
    light.style.left = id[3].xyz[0] + "px";
    light.style.top = id[3].xyz[1] + "px";
    light.style.zIndex = "0";
    light.style.scale = id[3].xyz[2];
    light.src = json_map_link + light_anim + light_max_anim + ".png";
  }
  
// if (json_map["other map asset"]["pop-up speed limit"] !== false) {
    let popup1 = document.createElement("img")
        
    document.getElementById("GUI element").appendChild(popup1);
    
    //var id = json_map["other map asset"]["pop-up speed limit"]
    //console.log(id[0] + " add")
    popup1.style.position = "absolute";
    popup1.style.left = "270px";
    popup1.style.top = "-345px";
    popup1.style.zIndex = "2";
    popup1.id = "popup1";
    popup1.style.scale = 0.12;
    popup1.style.visibility = "hidden";
    popup1.src = "images/pop-up speed.png"
 // }
  loop4()
}

// other things #sound #on...

function onloading_end() {
  console.log("game command list: ");
  console.log("tab(go to a file)")
  console.log("meter(number)")
  console.log("speed(number) ")
}

function interact_load() {
  
  let ambiance1 = new Audio(json_train_link + json_train.sound.motor["ambiance1"][0] + ".ogg");
  ambiance1.play();
  ambiance1.loop = true;
  ambiance1.volume = json_train.sound.motor["ambiance1"][1].volume;
  
  let ambiance2 = new Audio(json_train_link + json_train.sound.motor["ambiance2"][0] + ".ogg");
  ambiance2.play();
  ambiance2.loop = true;
  ambiance2.volume = json_train.sound.motor["ambiance2"][1].volume;
  
  let neutre1 = new Audio(json_train_link + json_train.sound.motor["neutre1"][0] + ".ogg");
  neutre1.play();
  neutre1.loop = true;
  neutre1.volume = json_train.sound.motor["neutre1"][1].volume;

  let warning_doors = new Audio(json_train_link + json_train.sound["pre-closing doors"][0] + ".ogg");
  warning_doors.play();
  warning_doors.loop = true;
  warning_doors.volume = 0;
  
  let aws_sound = new Audio(json_train_link + json_train.sound["AWS"][0] + ".ogg");
  aws_sound.play();
  aws_sound.loop = true;
  aws_sound.volume = 0;
  
  var T = null;
  var pitcht = null;
  setInterval(function () {
    
    // ambance multiplication 
    var T = train.speed // * 0.5;
    pitcht = T * json_train["train option"]["ambiance speed pitch"];
    ambiance1.playbackRate = pitcht
        
    if (train.speed >= 1) {
      ambiance1.volume = 1;
      neutre1.volume = 0;
    } else {
      ambiance1.volume = 0;
      neutre1.volume = json_train.sound.motor["neutre1"][1].volume;;
    }
    // ambiance1.mozPreservesPitch = false 
    ambiance1.preservesPitch = false;
    if (train.speed >= 0 && train.speed <= 1.1 ) {
      ambiance1.currentTime = 1;
    }
    
    // aws 
    
    if (train.AWS.on == true) {
      aws_sound.volume = json_train.sound["AWS"][1].volume;
    } else if (train.AWS.on == false) {
      aws_sound.volume = 0;
    }
    
    if (train.door.value == 3) {
      warning_doors.volume = json_train.sound["pre-closing doors"][1].volume
    } else {
      warning_doors.volume = 0;
    }
    
  },1)
}

function doors(f) {
  var v = true;

  if /* close doors */ (f == "close" && train.door.value == 3 && v == true) {
    var sound = new Audio(json_train_link + json_train.sound["doors open/close"][1] + ".ogg");
    sound.play()
    
    train.door.value = 1;
    
    document.getElementById('button_closedoors').style.filter = "brightness("+100+"%)";
    v = false;
  }
  
  if /* warning doors closing*/ (f == "close" && train.door.value == 2 && v == true) {
    
    
    train.door.value = 3;
    
    document.getElementById('button_opendoors').style.filter = "brightness("+100+"%)";
    document.getElementById('button_closedoors').style.filter = "brightness("+200+"%)";
    v = false;
  }
  
  if /* open doors */ (f == "open" && train.door.value == 1 && v == true) {
    var sound = new Audio(json_train_link +json_train.sound["doors open/close"][0] + ".ogg");
    sound.play()
    
    train.tension_dows = false;
    
    train.door.value = 2;
    document.getElementById('button_opendoors').style.filter = "brightness("+200+"%)";
    v = false;
  } 

}

function button_click(){
  var click = new Audio(json_train_link + json_train.sound.click + ".ogg");
  click.play();
}

// #maps gui
setInterval(function (){
  if (game.mini_maps == "false"){
    document.getElementById("mini maps").style.opacity = "0.95"
    document.getElementById("mini maps").style.left = "-260px"
  } else {
    document.getElementById("mini maps").style.opacity = "0.2"
    document.getElementById("mini maps").style.left = "-365px"
  }
},0)
    
function loading_finisch(){
  
}

// loop script

let i1 = 0;
let i2 = 0;
let i3 = 0;
let random = Math.random() * 5;

function loop() {
  loop1 = setInterval(() => {
    // Bg anim
    
    if (i1 >= BG_max_anim) {
      i1 = -1;
    }
    
    i1++;
    if (i1 <= BG_max_anim && train.speed >= 2) {
      BG.src = json_map_link + BG_anim + i1 + ".png";
    }
    
    // light anim 
    
    if (i2 >= light_max_anim + train.show_speed * 0.4) {
      i2 = -1;
    }
    i2++;
    if (i2 <= light_max_anim && train.speed >= 2 && light_anim !== null) {
      light.src = json_map_link + light_anim + i2 + ".png";
    }
    
    // train pass anim 
    
    if (i3 >= train_passing_max_anim + train.show_speed * random) {
      i3 = -1;
      random = Math.random() * train_passing_interval * 0.4;
      random += 2;
    }
    i3++;
    if (i3 <= train_passing_max_anim && train.speed >= 2 && train_passing_anim !== null) {
      train_passing.src = json_map_link + train_passing_anim + i3 + ".png";
    }
  },100)
}


function loop2(param) {
var loop2 = setInterval(() => {
  
  if (json_train["train option"]["train sound type"] == 1) {
    if (train.tension_up == true && train.speed <= 119) {
      if (train.speed <= 15) {
        train.show_speed -= 0.5;
        train.speed += 0.5;
      } else if (train.speed <= 45) {
        train.show_speed -= 0.9;
        train.speed += 0.9;
      } else {
        train.show_speed -= 0.5;
        train.speed += 0.5;
      }
    }
  } else {
    error("error ! | train sound type invalid :"+json_train["train option"]["train sound type"])
    clearInterval(loop2)
  }
  
  if (train.tension_dows == true && train.show_speed <= 119) {
    train.show_speed += 1.1;
    train.speed -= 1.1;
  } else {
    
  }
  },train.traction_speed)
}

function next_stop(A,B,C) {
  if (C == null) {
    document.getElementById("center GUI").innerText = "the next stop is "+A+" in "+B.substr(0,10);
    if (B <= 65) {
      document.getElementById("center GUI").style.border = "7px solid blue";
      document.getElementById("center GUI").style.backgroundColor = "blue";
    } else {
      document.getElementById("center GUI").style.border = "7px solid dodgerblue";
      document.getElementById("center GUI").style.backgroundColor = "dodgerblue";
    }
  } 
  
  if (C == "int") {
    document.getElementById("center GUI").style.left = -100+"px";
    var i = -700;
    
    var loop = setInterval(() => {
      if (i <= -50) {
        i++;
      } else {
        clearInterval(loop);
      }
      document.getElementById("center GUI").style.left = i * 2 + "px";
    },0)
  }
  
  if (C == "out") {
    document.getElementById("center GUI").style.left = -50 + "px";
    var i = -50;
    
    var loop = setInterval(() => {
      if (i >= -900) {
        i--;
        
      } else {
        clearInterval(loop);
      }
      document.getElementById("center GUI").style.left = i * 2 + "px";
    }, 10)
  }
}

function loop3() { // traject event and meter system
  var i3 = 0;
  var i6 = 0;
  var traject_max = json_ligne.maps.trajet.length-1;

  var R = setInterval(function () {
    //document.getElementById("m").innerText = "meter:"+game.meter;
    
    if (train.speed >= 1) {
      game.meter += train.speed * 0.0005;
    }
    
    localStorage.setItem("meter",15 + game.meter); // for the GUI
    
    if (i3 <= traject_max) {
      if (json_ligne.maps.trajet[i3][2].distance <= game.meter) {
        
        // popup speed limit
        if (json_ligne.maps.trajet[i3][0] == "speed") {
          
          if (json_ligne.maps.trajet[i3][2].pre_release == true) {
            game.popup1.warning = true;
          } else {
            game.popup1.warning = false;
            document.getElementById("popup1").style.opacity = 1;
            document.getElementById("speed popup").style.opacity = 1;
          }
        
          if (json_ligne.maps.trajet[i3][2].hide == true) {
            document.getElementById("popup1").style.visibility = "hidden"
            document.getElementById("speed popup").style.visibility = "hidden"
            game.popup1.warning = false;
          } else {
            document.getElementById("popup1").style.visibility = "visible";
            document.getElementById("speed popup").style.visibility = "visible"
          }
          game.popup1.speed_limit = json_ligne.maps.trajet[i3][1];
          document.getElementById('speed popup').innerText = json_ligne.maps.trajet[i3][1];
        }
        
        i3++;
      }
    } else {
      // #end
      alert("you finish it !")
      clearInterval(R)
      window.location = 'menu.html';
    }
    
    if (i6 <= traject_max) {
      if (json_ligne.maps.trajet[i6][0] == "station" ) {
        
        if (json_ligne.maps.trajet[i6][2].distance - 150 <= game.meter && json_ligne.maps.trajet[i6][2].distance - 0 >= game.meter) {
          document.getElementById("center GUI").style.visibility = "visible";
        } else {
          document.getElementById("center GUI").style.visibility = "hidden";
        }
        
        if (json_ligne.maps.trajet[i6][2].distance - 150 >= game.meter && json_ligne.maps.trajet[i6][2].distance - 150.009 <= game.meter) {
          next_stop(null,null,"int");
        }
      
        if (json_ligne.maps.trajet[i6][2].distance <= game.meter) {
          i6++;
        }
        
        next_stop(game.station.next_station,game.station.next_station_distance + "",null)
        game.station.next_station_distance = json_ligne.maps.trajet[i6][2].distance - game.meter;
        if (game.next_station !== json_ligne.maps.trajet[i6][1]) {
          game.station.next_station = json_ligne.maps.trajet[i6][1]
        }
        /*[2].distance*/
      } else {
        i6++;
      }
      
      // #BG event
      if (json_ligne.maps.trajet[i3][0] == "BG anim" ) {
        
        BG_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][0];
        BG_max_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][1];
        
        if (json_map["body"][json_ligne.maps.trajet[i3][1]][0] == false) {
          clearInterval(R)
          error("error ! | no BG asset found ")  
        }
        
        if (json_map["body"][json_ligne.maps.trajet[i3][1]][3]["light"][0] !== false) {
          light_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][3]["light"][0];
          light_max_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][3]["light"][1];
        } else {
          light_anim = null;
        }

        if (json_map["body"][json_ligne.maps.trajet[i3][1]][3]["train passing"] !== false) {
          train_passing_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][3]["train passing"][0][0];
          train_passing_max_anim = json_map["body"][json_ligne.maps.trajet[i3][1]][3]["train passing"][0][1];
          train_passing_interval = json_map["body"][json_ligne.maps.trajet[i3][1]][3]["train passing"][0][2];
        } else {
          train_passing_anim = null;
        }
      }
    }
    
    // when max speed break
    
    if (train.speed >= game.popup1.speed_limit + 4 && game.popup1.warning == false) {
      train.AWS.on = true;
    }
    
    // loop 
    
},0)
  
  var i5 = 0;
  var i4 = 0;
  
  setInterval(function() {
    if (i4 == 1 && game.popup1.warning == true) {
      i4 = 0;
      document.getElementById("popup1").style.opacity = 0.5
      document.getElementById("speed popup").style.opacity = 0.5;
    } else {
      i4 = 1;
      document.getElementById("popup1").style.opacity = 1
      document.getElementById("speed popup").style.opacity = 1;
    }
    
    // when the AWS it active
    
    if (train.AWS.on == true) {
      document.getElementById("aws").style.filter = "brightness("+200+"%)";
      i5 += 1;
      if (i5 >= 7 && train.speed >= 1) {
        train.speed = 0;
        train.show_speed = 120;
        train.tension_up = false;
        train.AWS.on = false;
      }
    }
    
    if (train.AWS.on == false) {
      i5 = 0;
      document.getElementById("aws").style.filter = "brightness("+100+"%)";
    }
    
  },1000)
}

function loop4() {
  setInterval(() => {
    train.speed2 = train.speed + "";
    
    if (train.speed <= 10) {
      document.getElementById("guispeed").innerText = train.speed2.substr(0,1) +" km/h";
    } else if (train.speed <= 120) {
      document.getElementById("guispeed").innerText = train.speed2.substr(0,2) +" km/h";
    }
    
    if (train.speed <= 0.8 && train.tension_up == false &&  train.tension_dows == false) {
      train.speed = 0
      train.show_speed = 120
    }
    
    if (train.speed >= 0.8 && train.tension_up == false &&  train.tension_dows == false) {
      // the train lose speed 
      train.show_speed += 0.0007;
      train.speed -= 0.0007;
    }
    game.mini_maps = localStorage.getItem("mini Gui");
  },0)
}

function error(A,redirect) {
  window.location = "menu.html";
  alert(A);
}

// command

function $meter(p) {
  game.meter += p;
}

function $tab(p) {
  window.location = p;
}

function $speed(p) {
  game.speed += p;
  game.speed2 -= p;
}

loop()
