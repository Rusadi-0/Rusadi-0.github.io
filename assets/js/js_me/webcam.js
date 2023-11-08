Webcam.set({
    width: 400.5,
    height: 280.5,
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
    

    Webcam.upload(base64image, '/BukuTamu/upload', function(code, text) {
      document.getElementById("gambar").value = text;
      document.getElementById("gambar1").value = text;
      document.getElementById("ambil").setAttribute("disabled", true);  
      document.getElementById('reset').disabled = false;
    });
  }

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 119) {
        take_snapshot();
        document.getElementById("ambil").setAttribute("disabled", true);  
      document.getElementById('reset').disabled = false;
    };
  };


