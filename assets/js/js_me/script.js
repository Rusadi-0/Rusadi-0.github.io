window.setTimeout(function() {
  $(".notifAlert").fadeTo(300, 0).slideUp(300, function() {
      $(this).remove();
  });
}, 4000);


const elemenAnimasi = document.querySelectorAll(".animasiKaban");

if(window.innerWidth > 800){
  elemenAnimasi.forEach(elemen => {
    elemen.classList.remove("animate__fadeInLeftBig");
    elemen.classList.remove("animate__fadeInRightBig");
  });
}
function animasiSide(angka) {
  if(angka == 4){
      elemenAnimasi.forEach(elemen => {
        elemen.classList.add("animate__fadeOutLeftBig");
      });
  } else if(angka == 1){
      elemenAnimasi.forEach(elemen => {
        elemen.classList.add("animate__fadeOutRightBig");
      });
  }
}

const submitButtons = document.querySelectorAll('.bxs-save');
const disabledButtons =document.querySelectorAll('button');
const loginBottons = document.querySelector('#login');


function submitBottons(){
  submitButtons.forEach(function(save) {
    save.classList.remove('bxs-save');
    save.classList.add('bx-loader-alt');
    save.classList.add('bx-spin');
  });  
  disabledButtons.forEach(function(dis) {
    window.setTimeout(function() {
      dis.disabled = true;
    }, 20);
  });  
}

function buttonsLogin(){
  window.setTimeout(function() {
    loginBottons.innerHTML = "<i class='bx bx-loader-alt bx-spin fs-4'></i>";
    loginBottons.disabled = true;
  }, 50);
  setTimeout(function() {
    alert("Seperinya ada gangguan Koneksi Jaringan, silahkan refresh ulang.");
    location.reload();
}, 1000*60*3); //5 menit
}




