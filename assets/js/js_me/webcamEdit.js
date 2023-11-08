Webcam.set({
    width: 420,
    height: 300,
    image_format: 'jpg',
    jpeg_quality: 90
  });
  Webcam.attach('#my_camera');
  function take_snapshot() {
    Webcam.snap(function(data_uri) {
      document.getElementById('results').innerHTML =
        '<img id="imageprev" class="card-img-top" src="' + data_uri + '"/>';
    });
    var base64image = document.getElementById("imageprev").src;
    
    document.getElementById("ambil").setAttribute("disabled", true);
    document.getElementById("reset").disabled = false;

    Webcam.upload(base64image, '/BukuTamu/upload', function(code, text) {
      let gambar = document.getElementById("gambar").value = text;
      document.getElementById("gambar").value = text;
      document.getElementById("gambar1").value = text;
      if (gambar == "tidak ada") {
        document.getElementById("rekamEdit").setAttribute("disabled", true);
        
      } else {
        document.getElementById("rekamEdit").disabled = false;
      }
    });
  }

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 119) {
        take_snapshot();
        document.getElementById("ambilEdit").setAttribute("disabled", true);  
      document.getElementById('resetEdit').disabled = false;
    };
  };


