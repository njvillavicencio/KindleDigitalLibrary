

$(document).ready(function(){


    $("body").on('click',"#escanear", function(){
        // $('#form_persona').show();
        // document.getElementById('form_persona').style.display = 'block';
        document.getElementById('barcode-scanner').style.display = 'block';
        document.getElementById('escanear').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('form_sku').style.display = 'none';
        getEscaner();
      });  

      $("body").on('click',"#cerrar", function(){
        Quagga.stop();
        document.getElementById('barcode-scanner').style.display = 'none';
        document.getElementById('escanear').style.display = 'block';
        document.getElementById('cerrar').style.display = 'none';
      }); 


});

      






          function getEscaner($btn){


            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                  Quagga.stop();
                  console.log(last_code)
                  document.getElementById('barcode-scanner').style.display = 'none';
                  document.getElementById('form_sku').style.display = 'block';
                  document.getElementById('cerrar').style.display = 'none';
                  document.getElementById('escanear').style.display = 'block';
                }
                
                );
     
    
    
            Quagga.init({
                inputStream : {
                  name : "Live",
                  type : "LiveStream",
                  numOfWorkers: navigator.hardwareConcurrency,
                  target: document.querySelector('#barcode-scanner')  
                },
                decoder: {
                    readers : ['ean_reader','ean_8_reader','code_39_reader','code_39_vin_reader','codabar_reader','upc_reader','upc_e_reader']
                }
              },function(err) {
                  if (err) { console.log(err); return }
                  Quagga.initialized = true;
                  Quagga.start();
              });
            

          }
