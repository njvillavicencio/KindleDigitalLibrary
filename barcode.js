

$(document).ready(function(){


    $("body").on('click',"#scan_button", function(){
        // $('#form_persona').show();
        // document.getElementById('form_persona').style.display = 'block';
        document.getElementById('barcode-scanner').style.display = 'block';
        document.getElementById('scan_button').style.display = 'none';
        document.getElementById('cerrar').style.display = 'block';
        document.getElementById('form_sku').style.display = 'none';
        getEscaner();
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
       writeCells('1UYFvau6chumF-t7izY-AtOB7TPX_hkEO34uLLWBdIKY', 'Entradas!A1:E1',[codigo,nombre,2,0,0]);
      });  
    

});


          function getEscaner($btn){
            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                  Quagga.stop();
                  var data={};
                  var request=readCells('1UYFvau6chumF-t7izY-AtOB7TPX_hkEO34uLLWBdIKY', 'Entradas!A:E');
                  request.then(function(response) {
                    data= response.result.values;
                    }, function(reason) {
                        console.error('error: ' + reason.result.error.message);
                  });	
                console.log(data);
                  var dataBase={};               
                  for (var i = 0; i < data.length; i++) {
                      var id = data[i][0];
                      var description = data[i][1];    
                      dataBase[id].push[description];
                  }
                  console.log(dataBase);
                  document.getElementById('barcode-scanner').style.display = 'none';
                  document.getElementById('form_sku').style.display = 'block';
                  document.getElementById('scan_button').style.display = 'block';
                  document.getElementById("codigo_barra").value = last_code;
                  document.getElementById("codigo_barra").disabled = true;
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
