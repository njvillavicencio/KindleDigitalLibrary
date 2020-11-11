$(document).ready(function(){


    $("body").on('click',"#escanear", function(){
        getEscaner();
        document.getElementById('escaner').style.display = 'block';
        document.getElementById('escanear').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('datos').style.display = 'none';
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
       var validacion = validarStock(codigo, parseInt(cantidad));
       if (validacion) {
// pormientras           escribirBaseDatos(codigo,descripcion,parseInt(cantidad));       
// pormientras           escribirDatos(idArchivo, nombreHoja+"!A1:E1",[codigo,descripcion,cantidad,0,0]);
           document.getElementById("datos").reset();
           escanear();
       }
       else {
           alert("Este artículo no tiene stock suficiente.");           
       }
      });  
    

});

function escanear(){
        getEscaner();
            document.getElementById('escaner').style.display = 'block';
        document.getElementById('escanear').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('datos').style.display = 'none';
}


          function getEscaner($btn){
            let detectionHash={};
            Quagga.onDetected(function(result) {
                var validCode = true;
                var codeErrors = [];
                var median;
                for (var i=1; i<=result.codeResult.decodedCodes.length-1;i++){
                    codeErrors.push(result.codeResult.decodedCodes[i].error);
//                    if (result.codeResult.decodedCodes[i].error>0.1){
//                        validCode=false;
                        
//                    }
                }              
                codeErrors.sort(function(a, b){return a-b});
//                 if (codeErrors.length % 2 == 0) {
//                     median=codeErrors[codeErrors.length/2];                    
//                 }
//                 else {
                     //median=(codeErrors[Math.floor(codeErrors.length/2)-1]+codeErrors[Math.floor(codeErrors.length/2)+1])/2;
                median=codeErrors[Math.floor(codeErrors.length/2)+1];
//                 }
                 if (median>0.1) {
                     validCode=false;
                 }
                
                if (validCode) {
                    if (detectionHash[result.codeResult.code]>=1){
                        detectionHash[result.codeResult.code]=detectionHash[result.codeResult.code]+1;
                    }
                    else
                    {
                        detectionHash[result.codeResult.code]=1;
                    }
                }
                if(detectionHash[result.codeResult.code] >= 5) {
                    detectionHash = {};
                    var last_code = result.codeResult.code;
                    Quagga.stop();
// por mientras                    leerBaseDatos(last_code);
                }
            },function(reason) {
       		console.error('error: ' + reason.result.error.message);
      	});
    
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
