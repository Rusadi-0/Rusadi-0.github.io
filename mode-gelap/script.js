function modeGelap(){
    document.getElementById('modeGelap').remove();
    document.getElementsByClassName('gas')[0].style.backgroundColor = '#3a3556';
    document.getElementsByClassName('gas')[1].style.backgroundColor = '#3a3556';
    document.getElementById('mode').innerHTML = `<button onclick="modeTerang()" id="modeTerang" class="mode shadow m-2 btn btn-dark"><i class=" bi-sun-fill"></i></button>`;
    var glp = document.getElementsByTagName("body")[0];
    glp.style.backgroundColor= "#333456";
    glp.style.color = '#ededed';

    

  }
  function modeTerang(){
    document.getElementById('modeTerang').remove();
    document.getElementsByClassName('gas')[0].style.backgroundColor = 'white';
    document.getElementsByClassName('gas')[1].style.backgroundColor = 'white';
    document.getElementById('mode').innerHTML = `<button onclick="modeGelap()" id="modeGelap" class="mode shadow m-2 btn btn-dark"><i class="bi-moon-fill"></i></button>`;
    var trg = document.getElementsByTagName("body")[0];
    trg.style.backgroundColor= "aliceblue";
    trg.style.color= "black";

  }

  function hpsHal(){
      
  }