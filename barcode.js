

$(document).ready(function(){


    $("body").on('click',"#scan_button", function(){
        // $('#form_persona').show();
        // document.getElementById('form_persona').style.display = 'block';
        escanear();
      });  

      $("body").on('click',"#cerrar", function(){
        Quagga.stop();
        document.getElementById('barcode-scanner').style.display = 'none';
        document.getElementById('scan_button').style.display = 'block';
        document.getElementById('cerrar').style.display = 'none';
      }); 
   
      $("body").on('click',"#save_button", function(){
       var codigo=document.getElementById("codigo_barra").value;
       var nombre = document.getElementById("descripcion").value;
       var cantidad = document.getElementById("cantidad").value;
       writeCells(codigo,nombre);       
       writeDataBase('1UYFvau6chumF-t7izY-AtOB7TPX_hkEO34uLLWBdIKY', 'Entradas!A1:E1',[codigo,nombre,cantidad,0,0]);
       document.getElementById("form_sku").reset()
       escanear();
      });  
    

});

function escanear(){
        document.getElementById('barcode-scanner').style.display = 'block';
        document.getElementById('scan_button').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('form_sku').style.display = 'none';
        getEscaner();
    
    
}



          function getEscaner($btn){
            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                Quagga.stop();
                readCells(last_code);
                }
                );
    
          Quagga.init({
                inputStream : {
                  name : "Live",
                  type : "LiveStream",
                  numOfWorkers: navigator.hardwareConcurrency,

                  constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment",
                  },
                  
                  area: { // defines rectangle of the detection/localization area
                    top: "33%",    // top offset
                    right: "33%",  // right offset
                    left: "33%",   // left offset
                    bottom: "33%"  // bottom offset
                  },



                  target: document.querySelector('#barcode-scanner')

                  
                },
                // locator: {
                //   patchSize: "x-large",
                //   halfSample: true
                // },
                decoder: {
                  readers: [
                    'code_128_reader'
                  ],
                  debug: {
                      drawBoundingBox: true,
                      showFrequency: true,
                      drawScanline: true,
                      showPattern: true
                  },
                  multiple: false
                },
                locate: false
              },function(err) {
                  if (err) { console.log(err); return }
                  Quagga.initialized = true;
                  Quagga.start();
              });

            

          }
