$(document).ready(function(){


    $("body").on('click',"#escanear", function(){
        // $('#form_persona').show();
        // document.getElementById('form_persona').style.display = 'block';
        escanear();
      });  

      $("body").on('click',"#cerrar", function(){
        Quagga.stop();
        document.getElementById('escaner').style.display = 'none';
        document.getElementById('escanear').style.display = 'block';
        document.getElementById('cerrar').style.display = 'none';
      }); 
   
      $("body").on('click',"#guardar", function(){
       var codigo=document.getElementById("codigo").value;
       var descripcion = document.getElementById("descripcion").value;
       var cantidad = document.getElementById("cantidad").value;
       escribirBaseDatos(codigo,descripcion);       
       escribirDatos(idArchivo, nombreHoja+"!A1:E1",[codigo,descripcion,cantidad,0,0]);
       document.getElementById("datos").reset()
       escanear();
      });  
    

});

function escanear(){
        document.getElementById('escaner').style.display = 'block';
        document.getElementById('escanear').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('datos').style.display = 'none';
        getEscaner();
    
    
}


          function getEscaner($btn){
            let detectionHash={};
            Quagga.onDetected(function(result) {
                if (detectionHash[result.codeResult.code]>=1){
                    detectionHash[result.codeResult.code]=detectionHash[result.codeResult.code]+1;
                }
                else
                {
                    detectionHash[result.codeResult.code]=1;
                }
                console.log(result.codeResult.decodedCodes,1);
                if(detectionHash[result.codeResult.code] >= 10) {
                    detectionHash = {};
                    var last_code = result.codeResult.code;
                    console.log(result.codeResult.decodedCodes,222);
                    Quagga.stop();
                    leerBaseDatos(last_code);
                }
                }
                );
    
          Quagga.init({
                inputStream : {
                  name : "Live",
                  type : "LiveStream",
                  numOfWorkers: navigator.hardwareConcurrency,
                  target: document.querySelector('#escaner')  
                },
                decoder: {
                    readers : ["code_128_reader","ean_reader","ean_8_reader","code_39_reader","code_39_vin_reader","codabar_reader","upc_reader","upc_e_reader","i2of5_reader","2of5_reader","code_93_reader"]
                }
              },function(err) {
                  if (err) { console.log(err); return }
                  Quagga.initialized = true;
                  Quagga.start();
              });

            

          }
