

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


      $("body").on('click',"#guardar", function(){
        guardarSKU();
        document.getElementById('form_sku').style.display = 'none';
      }); 


      

      

});

      






          function getEscaner($btn){


            Quagga.onDetected(function(result) {
                PlaySound();
                var last_code = result.codeResult.code;
                  Quagga.stop();
                  $.ajax({
                    type: "POST",
                    url: '/get_barcode',
                    data: { upc: last_code },
                    success: function(data){
                        if(1 == 1){
                            document.getElementById("codigo_barra").value = data.codigo_barra;
                            document.getElementById("codigo_barra").disabled = true;
                        }

                        else{
                            alert('No se han obtenidos resultados, vuelva a ingresar los campos');
                           
                            // Stop loading
                            //l.ladda( 'stop' );
                          }
                        }

                  });
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



          function guardarSKU($btn){


            
                var barcode = document.getElementById("codigo_barra").value;
                var descripcion = document.getElementById("descripcion").value;
                var categoria = document.getElementById("categoria").value;
                var cantidad = document.getElementById("cantidad").value;
                  $.ajax({
                    type: "POST",
                    url: '/guardar_sku',
                    data: { barcode: barcode,
                            descripcion:descripcion,
                            categoria:categoria,
                            cantidad:cantidad
                          }

                  });
          }








          function verTabla($btn){


            
            var barcode = document.getElementById("codigo_barra").value;
            var descripcion = document.getElementById("descripcion").value;
            var categoria = document.getElementById("categoria").value;
            var cantidad = document.getElementById("cantidad").value;
              

            var table2 = $('#TableResult').DataTable();
            table2.destroy();
            table2 = $('#TableResult').DataTable({
              'destroy': true,
              'paging': true,
              'lengthChange': true,
              'searching': true,
              'ordering': true,
              'info': true,
              'autoWidth': true,
              "language":{
                "sProcessing":     "Procesando...",
                            "sLengthMenu":     "Mostrar _MENU_ registros",
                            "sZeroRecords":    "No se encontraron resultados",
                            "sEmptyTable":     "Ningún dato disponible en esta tabla =(",
                            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix":    "",
                            "sSearch":         "Buscar:",
                            "sUrl":            "",
                            "sInfoThousands":  ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst":    "Primero",
                                "sLast":     "Último",
                                "sNext":     "Siguiente",
                                "sPrevious": "Anterior"
                            }
                }
            });
            table2.clear().draw();



              $.ajax({
                type: "POST",
                url: '/registros',
                data: { barcode: barcode,
                        descripcion:descripcion,
                        categoria:categoria,
                        cantidad:cantidad
                      },
                      success: function(data){
                        if(data.status == 1){
 
                          //  $('#buttonBuscarPorRutFinal').hide();
                           for (var i = data.resp.length - 1; i >= 0; i--) {
                            // var str =     '<td><button type="button" data-dismiss="modal" class="btn btn-secondary" id="'+data.resp[i].rut+'"'+ 'onclick="mostrarMilitanteSeleccionado('+data.resp[i].rut+');">Seleccionar</button></td>';
                            var str2 = [];
                            // str2.push(str);
                            str2.push(data.resp[i].barcode);
                            str2.push(data.resp[i].descripcion);
                            str2.push(data.resp[i].categoria);
                            str2.push(data.resp[i].cantidad);
                            table2.row.add(str2).draw();
                          }
                         
                          // Stop loading
                         // l.ladda( 'stop' );
                        }
                        else{
                          alert('No se han obtenidos resultados, vuelva a ingresar los campos');
                         
                          // Stop loading
                          //l.ladda( 'stop' );
                        }
                        
                      }

              });
        

      }



      function PlaySound() {
        // var sound = document.getElementById('sound1');
        // sound.Play();

        document.getElementById('sound1').play();
      }