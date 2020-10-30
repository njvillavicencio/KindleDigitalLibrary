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
       var nombre = document.getElementById("descripcion").value;
       var cantidad = document.getElementById("cantidad").value;
       escribirBaseDatos(codigo,nombre);       
       escribirDatos(fileId, nombreHoja+"!A1:E1",[codigo,nombre,cantidad,0,0]);
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
            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                Quagga.stop();
                leerBaseDatos(last_code);
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
                    readers : ['ean_reader']
                }
              },function(err) {
                  if (err) { console.log(err); return }
                  Quagga.initialized = true;
                  Quagga.start();
              });

            

          }
