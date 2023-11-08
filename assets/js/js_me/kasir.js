// ! VARIABEL 
const myHostname = window.location.hostname; //* untuk dijalankan ke htdocs
// const myHostname = "localhost"; //* untuk dijalankan ke dekstop
const inputDigit = 5;
const inputPersenUntung = 10;
const barcodeInput = document.getElementById('barcodeInput');
const output = document.getElementById('output');
const cartTableBody = document.querySelector('#cartTable tbody');
const totalPriceDisplay0 = document.getElementsByClassName('totalPrice')[0];
const totalPriceDisplay1 = document.getElementsByClassName('totalPrice')[1];
const koneksiServer = document.getElementById('koneksiServer');
const inputTransaksiJual = document.getElementById('inputTransaksiJual');
const formTransaksiJual = document.getElementById('formTransaksiJual');
const divFormTransaksiJual = document.getElementById("divFormTransaksiJual");

const hasilKembalian = document.getElementById('hasilKembalian');
const tombolTransaksi = document.getElementById('tombolTransaksi');
const hasilTotalTransakasi = document.getElementById('hasilTotalTransakasi');
const hasilKembalianTransakasi = document.getElementById('hasilKembalianTransakasi');
const tampilkanFormTransaksi = document.getElementById('tampilkanFormTransaksi');
const productList = document.getElementById('productList');
const btnClose = document.getElementById('btnClose');

const keranjangKosong = document.getElementById('keranjangKosong');
const modalTxs = document.getElementById('staticBackdrop');
const untungPersen = inputPersenUntung/100;
const totalPrice = 0;
const cart = {};


function btnCart (){
    setTimeout(function() {
        // barcodeInput.focus();
        
    }, 500);

}
// function klikClose (){
//     setTimeout(function() {
//         barcodeInput.focus();
        
//     }, 500);

// }

document.getElementById("barcodeInput").addEventListener("input", function (e) {
    let input = e.target.value;
    e.target.value = input.replace(/[^0-9]/g, "");
});

barcodeInput.addEventListener("input", function (e) {
    let input = e.target.value;
    e.target.value = input.replace(/[^0-9]/g, "");
});

    // menekan enter lanjut ke taransaksi
    function checkEnter(event) {
        if (event.key === "Enter") {
            // tombolTransaksi.click();
            setTimeout(function() {
                inputTransaksiJual.disabled = true;
                inputTransaksiJual.value = "";
                if(Object.keys(cart).length > 0){
                    inputTransaksiJual.disabled = false;
                    inputTransaksiJual.focus();
                }
            }, 500);
        }
    }


    var startTime = new Date().getTime(); // Waktu mulai permintaan

    var xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            var endTime = new Date().getTime(); // Waktu selesai permintaan
            var timeTaken = endTime - startTime; // Waktu yang diperlukan dalam milidetik
    
            var products = JSON.parse(xhr.responseText);
            setupKasir(products);
    
            var dataSize = xhr.responseText.length; // Ukuran data yang diambil dalam byte
            var speed = (dataSize / timeTaken) * 1000; // Kecepatan dalam byte per detik
    
            console.warn("Waktu yang diperlukan: " + timeTaken + " ms");
            console.warn("Kecepatan: " + speed + " bytes/detik");
            if(timeTaken > 5*1000){
                koneksiServer.innerHTML = "<h2>Koneksi ke server Lambat.</h2>";
            }else{
                barcodeInput.focus();
            }
        } else {
            koneksiServer.innerHTML = "<h2>Koneksi ke server terputus.</h2>";
        }
    };
    
    xhr.onerror = function() {
        koneksiServer.innerHTML = "<h2>Koneksi ke server terputus.</h2>";
    };
    
    xhr.open("GET", "http://" + myHostname + "/getProduk.php", true);
    xhr.send();

    function tai(code){
        barcodeInput.value = code;
    }
function setupKasir(products) {
// Inisialisasi variabel cart sebagai objek kosong
for (var barcode in products) {
    if (products.hasOwnProperty(barcode)) {
        var product = products[barcode];
        var buttonHtml = product.stok == 0 ? `
        <button class="btn btn-outline-danger add-to-cart-btn" data-barcode="${barcode}">
       Stok Habis
        </button>` : `
        <button class="btn btn-primary border-0 add-to-cart-btn" data-barcode="${barcode}">
        <i class='bx bx-plus-circle'></i> Cart
        </button>`;

        productList.innerHTML += `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <img src="../assets/img/produk/${barcode}.jpg" class="card-img-top px-4 pt-4" alt="...">
                    <div class="card-body">
                        <h6 class="card-title">${product.name}</h6>
                    </div>
                    <div class="card-footer border-0 bg-white">
                        <div class="d-flex justify-content-between mb-2">
                        <span class="text-start fw-light">
                            <small class="text-secondary"><i class='bx bx-package'></i>:${product.stok}</small>
                        </span>
                        <span class="text-end totalPrice text-primary fw-bold">Rp${formatRupiah(parseInt(product.price) * untungPersen + parseInt(product.price))}</span>
                        </div>
                    </div>
                    <div class="card-footer border-0 bg-white mb-1">
                        <div class="d-grid gap-2">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
    }
}


// Tambahkan event listener untuk tombol "Add to Cart"
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const barcode = this.getAttribute('data-barcode');
        tambahDataKeCart(products,barcode)
        // barcodeInput.focus();
    });
});

    barcodeInput.addEventListener('input', () => {
        const barcode = barcodeInput.value;
        tambahDataKeCart(products,barcode);
        barcodeInput.focus();
    });

    // Fokus ke input saat halaman dimuat
    

}

function tambahDataKeCart(products,barcode){
    if (products[barcode]) {
        const product = products[barcode];
        output.innerHTML = '';
        const princeInt = parseInt(product.price);
        const princePersenan =  princeInt * untungPersen + princeInt;

        if (cart[barcode]) {
            if (!modalTxs.classList.contains('show')) {
                tombolTransaksi.click();
              }
            inputTransaksiJual.value = "" ;
            formTransaksiJual.innerHTML = "Rp";
            formTransaksiJual.classList.remove("text-success");
            formTransaksiJual.classList.remove("text-danger");
            divFormTransaksiJual.classList.remove("border-danger");
            divFormTransaksiJual.classList.remove("border-success");
            if(cart[barcode].stok > (cart[barcode].quantity)){
                cart[barcode].quantity += 1;
                cart[barcode].totalPrice = cart[barcode].quantity * princePersenan;
                cart[barcode].price = princePersenan;
            } else{
                Swal.fire({
                    icon: 'error',
                    title: 'Stok terbatas!',
                    text: "Tersisa " + cart[barcode].stok + " " + cart[barcode].unit
                  })
                output.innerHTML = '';
            }
            // Jika produk dengan barcode yang sama sudah ada di keranjang, tambahkan jumlahnya
        } else {
            if(parseInt(product.stok) > 0){
            // Jika produk belum ada di keranjang, tambahkan ke keranjang
            if (!modalTxs.classList.contains('show')) {
                tombolTransaksi.click();
              }
            inputTransaksiJual.value = "";
            keranjangKosong.style.display= "none";

            inputTransaksiJual.value = "";
            formTransaksiJual.innerHTML = "Rp";
            formTransaksiJual.classList.remove("text-success");
            formTransaksiJual.classList.remove("text-danger");
            divFormTransaksiJual.classList.remove("border-danger");
            divFormTransaksiJual.classList.remove("border-success");      
            cart[barcode] = {
                name: product.name,
                price:  parseInt(princePersenan),
                totalPrice: parseInt(princePersenan),
                unit: product.unit,
                quantity: 1,
                stok: parseInt(product.stok)
            };
            } else{
                Swal.fire({
                    icon: 'warning',
                    title: 'Stok Habis',
                    text: 'Silahkan isi stok terlebih dahulu!'
                  })
                output.innerHTML = '';
            }

        }


        // Tambahkan produk ke daftar belanja
        
        renderCart();
        UpdateCart();
    } else {

        inputValue = barcodeInput.value;

        if (inputValue.length > 12) {
            output.innerHTML = '';
            Swal.fire({
                icon: 'error',
                title: 'Produk tidak ditemukan!',
                text: 'Silahkan daftar produk terlebih dahulu!',
              })
            setTimeout(function() {
                barcodeInput.focus();
                barcodeInput.value = '';
            }, 50);
            
        }
    }
}

function UpdateCart(){
            // Tambahkan harga produk ke total
            let totalPriceBos = 0;
            for (const barcode in cart) {
                totalPriceBos += cart[barcode].totalPrice;
            }
            totalPriceDisplay0.textContent = "Rp" + formatRupiah(totalPriceBos);
    
            function hitungJumlahDigit(angka) {
                // Mengonversi angka menjadi string
                var angkaString = angka.toString();
              
                // Menghitung panjang string, yang juga merupakan jumlah digit
                var jumlahDigit = angkaString.length;
                
                return jumlahDigit;
            }
            const digitTotalHarga = hitungJumlahDigit(totalPriceBos);
    
            const genapHargaTotalRibuan = (Math.floor(totalPriceBos /1000)*1000);
            const genapHargaTotalRibuDanRatusan = (Math.floor(totalPriceBos /100)*100);
            const hasilPenguranganRibuDanRatusan = genapHargaTotalRibuDanRatusan - genapHargaTotalRibuan;
    
            if(hasilPenguranganRibuDanRatusan < 100){
                var totalPriceDisplay = genapHargaTotalRibuan;
                totalPriceDisplay1.textContent = "Rp" + formatRupiah(totalPriceDisplay);
            }
            else if(hasilPenguranganRibuDanRatusan < 600){
                var totalPriceDisplay = genapHargaTotalRibuan + 500;
                totalPriceDisplay1.textContent = "Rp" + formatRupiah(totalPriceDisplay);
            }
            else if(hasilPenguranganRibuDanRatusan > 599){
                var totalPriceDisplay = genapHargaTotalRibuan + 1000;
                totalPriceDisplay1.textContent = "Rp" + formatRupiah(totalPriceDisplay);
            } else {
                alert("ERROR");
            }
    
            // console.log("digitTotalHarga = " + digitTotalHarga);
            // console.log("genapHargaTotalRibuan = " + genapHargaTotalRibuan);
            // console.log("genapHargaTotalRibuDanRatusan = " + genapHargaTotalRibuDanRatusan);
            // console.log("hasilPenguranganRibuDanRatusan = " + hasilPenguranganRibuDanRatusan);
    
            hasilTotalTransakasi.value = totalPriceDisplay;
            
            inputTransaksiJual.addEventListener('input', function() {
            if(inputTransaksiJual.value == 0){
                inputTransaksiJual.value = "";
                formTransaksiJual.innerHTML = "Rp";
                formTransaksiJual.classList.remove("text-success");
                formTransaksiJual.classList.remove("text-danger");
                divFormTransaksiJual.classList.remove("border-danger");
                divFormTransaksiJual.classList.remove("border-success");
            } else{
                const sanitizedValue = inputTransaksiJual.value.replace(/\D/g, '');
                
                // Memisahkan ribuan secara manual
                const formattedValue = addThousandSeparators(sanitizedValue);
    
                // Mengatur nilai input menjadi yang telah diformat
                inputTransaksiJual.value = formattedValue;
    
                const integerValue = parseInt(sanitizedValue, 10);
    
                    // Setel teks pada elemen <h2> dengan nilai dari elemen <input>
                    var totalKembalian = integerValue - totalPriceDisplay;
    
                    if(integerValue < totalPriceDisplay){
                        hasilKembalian.textContent = "Rp" + "0.00";
                        formTransaksiJual.innerHTML = `<i class='bx bx-x-circle'></i>`;
                        formTransaksiJual.classList.remove("text-success");
                        formTransaksiJual.classList.add("text-danger","mx-1");
                        divFormTransaksiJual.classList.add("border-danger");
                        divFormTransaksiJual.classList.remove("border-success");
                    } else if(totalKembalian == 0){
                        hasilKembalian.textContent = "Rp- PASS -";
                        formTransaksiJual.innerHTML = '<i class="bx bx-check-circle"></i>';
                        formTransaksiJual.classList.add("text-success","mx-1");
                        formTransaksiJual.classList.remove("text-danger");
                        divFormTransaksiJual.classList.add("border-success");
                        divFormTransaksiJual.classList.remove("border-danger");
                    } else if(integerValue > totalPriceDisplay){
                        hasilKembalian.textContent = 'Rp' + formatRupiah(totalKembalian);
                        formTransaksiJual.innerHTML = '<i class="bx bx-check-circle"></i>';
                        formTransaksiJual.classList.add("text-success","mx-1");
                        formTransaksiJual.classList.remove("text-danger");
                        divFormTransaksiJual.classList.add("border-success");
                        divFormTransaksiJual.classList.remove("border-danger");
                    } else {
                        console.error("ada error sayang..");
                    }
                    hasilKembalianTransakasi.value = totalKembalian;
            }
            });
    
    
            function addThousandSeparators(value) {
                return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
    
            // Kosongkan input barcode
            barcodeInput.value = '';
            
            output.innerHTML = '';
            // Sembunyikan tombol Clear
            barcodeInput.style.display = 'inline';
}


function renderCart() {
    cartTableBody.innerHTML = '';
    for (const barcode in cart) {
        const item = cart[barcode];
        const cartRow = document.createElement('tr');
        cartRow.innerHTML = `
        <td>
            <div onclick="seeOpsi(${barcode})" style="cursor: pointer; text-decoration: none;  background-color: transparent;" id="produk${barcode}" class="card m-0 border border-0 shadow-none">
                <div class="row g-0">
                    <div class="col-2">
                        <img src="../assets/img/produk/${barcode}.jpg" class="img-fluid pe-2" alt="...">
                    </div>
                    <div class="col-10">
                        <p class="fw-bold card-text">${item.name}</p>
                        <div class="d-flex justify-content-between">
                        <span class="card-text fw-light" id="itemQuantity${barcode}">${item.quantity}x</span>
                            <div id="seeOpsi${barcode}">
                            </div>
                            <span class="text-start card-text text-primary">Rp${formatRupiah(item.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </td>
        `;

        inputTransaksiJual.disabled = false;
        tampilkanFormTransaksi.style.display = "block";
        cartTableBody.appendChild(cartRow);
    }
}
function seeOpsi(barcode){
    if (cart[barcode].quantity == 1) {
        document.getElementById("seeOpsi" + barcode).innerHTML = `
        <button onclick="hapusProduk('${barcode}')" class="btn border-0 p-1 m-0 btn-outline-danger"><i class='bx bxs-trash'></i></button>|
        <button onclick="incrementQuantity('${barcode}')" class="btn border-0 p-1 m-0 btn-outline-primary"><i class='bx bxs-plus-square'></i></button>`;
    } else if(cart[barcode].quantity > 1){
        document.getElementById("seeOpsi" + barcode).innerHTML = `
        <button onclick="decrementQuantity('${barcode}')" class="btn border-0 p-1 m-0 btn-outline-danger"><i class='bx bxs-minus-square'></i></button>|
        <button onclick="incrementQuantity('${barcode}')" class="btn border-0 p-1 m-0 btn-outline-primary"><i class='bx bxs-plus-square'></i></button>`;
    }
    

    }


function incrementQuantity(barcode) {
    if (cart[barcode].quantity < cart[barcode].stok) {
        cart[barcode].quantity++;
        cart[barcode].totalPrice = cart[barcode].quantity * cart[barcode].price; // Memperbarui totalPrice
        renderCart();
        UpdateCart();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Stok terbatas!',
            text: "Tersisa " + cart[barcode].stok + " " + cart[barcode].unit,
          })
        output.innerHTML = '';
    }
}

function decrementQuantity(barcode) {
    if (cart[barcode].quantity > 1) {
        cart[barcode].quantity--;
        cart[barcode].totalPrice = cart[barcode].quantity * cart[barcode].price; // Memperbarui totalPrice
    }
    renderCart();
    UpdateCart();
}
function hapusProduk(barcode){
    delete cart[barcode];
    if(Object.keys(cart).length == 0){
        // Untuk menampilkan elemen dengan JavaScript
        tampilkanFormTransaksi.style.display = "none";
        keranjangKosong.style.display = "block";

        }
        renderCart();
        UpdateCart();
}




    // *Fungsi untuk mengonversi harga menjadi format Rupiah
    function formatRupiah(angka) {
        var number_string = angka.toString();
        var split = number_string.split('.');
        var sisa = split[0].length % 3;
        var rupiah = split[0].substr(0, sisa);
        var ribuan = split[0].substr(sisa).match(/\d{3}/g);

        if (ribuan) {
            var separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + '.' + split[1] : rupiah;
        return rupiah;
    }

// * untuk jika menekan tompbol esc
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        btnClose.click();
        setTimeout(function() {
            barcodeInput.focus();
        }, 500);
    }
});




var putXhrTambah = new XMLHttpRequest();
var putXhr = new XMLHttpRequest();

var putData = cart;

putXhr.onreadystatechange = function () {
    if (putXhr.readyState === 4) {
        if (putXhr.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Transaksi Berhasil',
                text: 'Proses cetak struk pembelian!'
              })
            setTimeout(function() {
                // alert("Transaksi Berhasil..");
                location.reload();
            }, 1700);
            
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Gagal memperbarui data.!',
                text: "Status: " + putXhr.status
              })
            console.error("Gagal memperbarui data. Status: " + putXhr.status);
        }
    }
};

putXhr.onerror = function() {
    alert("Koneksi ke server terputus")
    console.error("Koneksi ke server terputus.");
};

// *========================



    // Selesai Transaksi jika tekan enter
    function selesaiTransaksi(event) {
            if (event.key === "Enter") {
                if(inputTransaksiJual.value == "" || hasilKembalianTransakasi.value < 0){
                    inputTransaksiJual.focus();
                } else {
                    tombolSelesaiTransakasi();
                }
            }
        }

        function tombolSelesaiTransakasi(){
            if(inputTransaksiJual.value == "" || hasilKembalianTransakasi.value < 0){
                inputTransaksiJual.focus();
            } else {
            putXhr.open("PUT", "http://" + myHostname + "/updateProduk.php", true);
                    putXhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    putXhr.send(JSON.stringify(putData)); // Kirim data dalam format JSON
                    putXhrTambah.open("PUT", "http://" + myHostname + "/postTransaksi.php", true);
                    putXhrTambah.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    let varTotal = hasilTotalTransakasi.value;
                    let varKembalian = hasilKembalianTransakasi.value;

                    var putTambah= {
                        total: varTotal,
                        kembalian: varKembalian
                        };
                    putXhrTambah.send(JSON.stringify(putTambah)); // Kirim data dalam format JSON
            }
        }
