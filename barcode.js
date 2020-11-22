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
           escribirBaseDatos(codigo,descripcion,parseInt(cantidad));       
           escribirDatos(idArchivo, nombreHoja+"!A1:E1",[codigo,descripcion,cantidad,Date.now(),Date()]);
           document.getElementById("datos").reset();
           escanear();
       }
       else {
           alert("Este artículo no tiene stock suficiente.");           
       }
      });  
});

// programa
    function obtenerDatosApp(booleano) {
        gapi.client.drive.files.list({
          spaces: 'appDataFolder',
          fields: 'files(id,name)'
        }).then(function(response) {
          var archivos = response.result.files;
          if (archivos && archivos.length > 0) {
            var archivo = archivos[0];
            obtenerArchivo(archivo.name, booleano);
	        idArchivo=archivo.name;
          }    
         else {
		    crearArchivo();
	      }
        });
      }
      
      function crearDatosApp(fileId) {
        gapi.client.drive.files.create({
          resource: {
            name: fileId,
            parents: ['appDataFolder']
          },
          fields: 'id'
        }).then(function (data) {obtenerDatosApp(false);});
        
      };
   function obtenerArchivo(idArchivo, booleano) {
 	var request = gapi.client.sheets.spreadsheets.get({spreadsheetId: idArchivo});
        request.then(function(response) {
		data= response.result.sheets;
		var encontrarHoja=-1;
		//var nombreHoja = "";
		for (var i=0; i < data.length; i++)
		{
			if (data[i].properties.sheetId==0){			
				encontrarHoja=0;
				nombreHoja=data[i].properties.title;
			}
		}
		if (encontrarHoja==-1) {
			crearHoja(idArchivo);	
		}
		else {
			leerDatos(idArchivo,nombreHoja+"!A:E", booleano);	
		}

      	}, function(reason) {
		crearArchivo();
       		console.error('error: ' + reason.result.error.message);
      	}); }
	      
	      
    function crearHoja(idArchivo) {
      var params = {spreadsheetId: idArchivo};
      var batchUpdateSpreadsheetRequestBody = {
        requests: [{"addSheet": {"properties": {"sheetId": 0,"title": "Datos Escaneados"}}}], 
      };
      var request = gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody);
      request.then(function(response) {
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }   
	      
    function crearArchivo() {
      var spreadsheetBody = {"properties": {"title": "BarCodeScanner"},"sheets": [{"properties": {"sheetId": 0,"title": "Datos Escaneados"}}]}
      var request = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
      request.then(function(response) {
        crearDatosApp(response.result.spreadsheetId);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }

    function leerDatos(idArchivo, rango, booleano) {
	var params = {spreadsheetId: idArchivo,  range: rango};	   
	var request = gapi.client.sheets.spreadsheets.values.get(params);  
	request.then(function(response) {
        	datos= response.result.values;  
		if (!(datos === undefined)) {
			for (var i = 0; i < datos.length; i++) {
				var codigo= datos[i][0];
				var descripcion = datos[i][1];
				var cantidad = parseInt(datos[i][2]);
				if (!(codigo in baseDatos)){ 
					baseDatos[codigo]=descripcion;
					balanceStock[codigo]=cantidad;
				}
				else {
					balanceStock[codigo]=balanceStock[codigo]+cantidad;
				}
				
			}
         	}
		if (booleano){llenarTabla();}
         }, function(reason) {
             console.error('error: ' + reason.result.error.message);
         });	    
   }	      
    function validarDatos(){
	var largoDescripcion = document.getElementById('descripcion').value.length;
	var largoCantidad = document.getElementById('cantidad').value.length;
	var cantidad = parseInt(document.getElementById('cantidad').value);
        if(largoDescripcion > 0 && largoCantidad>0 && cantidad!=0)  { 
            document.getElementById('guardar').disabled = false; 
        } else { 
            document.getElementById('guardar').disabled = true;
        }
    }
   function leerBaseDatos(codigo) {
	   console.log(baseDatos);
		var descripcion="";
		if (codigo in baseDatos){ 
                	descripcion = baseDatos[codigo];		
		}
                document.getElementById('escaner').style.display = 'none';
                document.getElementById('datos').style.display = 'block';
                document.getElementById('escanear').style.display = 'block';
                document.getElementById("codigo").value = codigo;
                document.getElementById("codigo").disabled = true;
		document.getElementById("descripcion").value = descripcion;
		if (descripcion.length>0){
                document.getElementById("descripcion").disabled = true;  
		}
   }
		
   function escribirBaseDatos(codigo, descripcion, cantidad) {
		if (!(codigo in baseDatos)){ 
                	baseDatos[codigo]=descripcion;	
			balanceStock[codigo]=cantidad;
		} 
	   	else {
			balanceStock[codigo]=balanceStock[codigo]+cantidad;
		}
   }
	
	      
	      function validarStock(codigo,cantidad) {
		if (cantidad>0){
			return true;
		}
		else if (balanceStock[codigo]+cantidad>=0){
			return true;
		}
		else {
			return false;	
		}
		      
	      }
   function escribirDatos(fileId, range, information) {
      var params = {
        spreadsheetId: fileId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS'};
      var valueRangeBody = {'values': [information],'majorDimension':'ROWS'};
      var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
      request.then(function(response) {
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }

    function llenarTabla() { 
     var table = document.getElementById("dataTable");
     var this_tbody = document.createElement('tbody');
     table.appendChiled(this_tbody);
     for (var codigo in baseDatos) {     
         var this_tr = document.createElement("tr");
	     
         var this_td = document.createElement("td");
         var text = document.createTextNode(codigo);
         this_td.appendChild(text);
         this_tr.appendChild(this_td);
	 this_tbody.appendChild(this_tr);
       
         var this_td = document.createElement("td");
         var text = document.createTextNode(baseDatos[codigo]);
         this_td.appendChild(text);
         this_tr.appendChild(this_td);
         this_tbody.appendChild(this_tr);
       
         var this_td = document.createElement("td");
         var text = document.createTextNode(balanceStock[codigo]);
         this_td.appendChild(text);
         this_tbody.appendChild(this_tr);
     }
}

//-----escaner

        function escanear(){
                getEscaner();
                document.getElementById('escaner').style.display = 'block';
                document.getElementById('escanear').style.display = 'none';
                document.getElementById('cerrar').style.display = 'block';
                document.getElementById('datos').style.display = 'none';
        }

          function getEscaner($btn){
	   let detectionHash={};
		  
	  	Quagga.onProcessed(function(result) {
      	  	var drawingCtx = Quagga.canvas.ctx.overlay,
         	drawingCanvas = Quagga.canvas.dom.overlay;

	      if (result) {
		  if (result.boxes) {
		      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
		      result.boxes.filter(function (box) {
			  return box !== result.box;
		      }).forEach(function (box) {
			  Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
		      });
		  }

		  if (result.box) {
		      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
		  }

		  if (result.codeResult && result.codeResult.code) {
		      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
		  }
      	     }
  	  });			  
		  
		  
		  
            Quagga.onDetected(function(result) {
                var barcodeErrors = [];
		var barcodeCodes = [];
                var median;
		var maximum;
		var mean;
		var minimum;
		var barcodeBadCodes=0;
		
                for (var i=1; i<=result.codeResult.decodedCodes.length-1;i++){
                    barcodeErrors.push(result.codeResult.decodedCodes[i].error);
		    barcodeCodes.push(result.codeResult.decodedCodes[i].code);
		    if (result.codeResult.decodedCodes[i].code==-1) {
			barcodeBadCodes=barcodeBadCodes+1;
		    }
		    
                }              
                barcodeErrors.sort(function(a, b){return a-b});
                median=barcodeErrors[Math.floor(barcodeErrors.length/2)+1];
		maximum=Math.max.apply(null, barcodeErrors);
		minimum=Math.min.apply(null, barcodeCodes);
		mean = barcodeErrors => barcodeErrors.reduce((a,b) => a + b, 0) / barcodeErrors.length;
		if (maximum <=1 && barcodeBadCodes/barcodeErrors.length<=0.15){
			 if (median<=0.10) {
			     if (detectionHash[(result.codeResult.code,'median')]>=1){
				detectionHash[(result.codeResult.code,'median')]=detectionHash[(result.codeResult.code,'median')]+1;
			     }
			     else
			     {
				detectionHash[(result.codeResult.code,'median')]=1;
			     }

			 }
			 if (mean<=0.05 && median<=0.12) {//la idea es agregar criterios adicionales
			     if (detectionHash[(result.codeResult.code,'mean')]>=1){
				detectionHash[(result.codeResult.code,'mean')]=detectionHash[(result.codeResult.code,'mean')]+1;
			     }
			     else
			     {
				detectionHash[(result.codeResult.code,'mean')]=1;
			     }

			 }
			 if (maximum<=0.08) {
			     if (detectionHash[(result.codeResult.code,'maximum')]>=1){
				detectionHash[(result.codeResult.code,'maximum')]=detectionHash[(result.codeResult.code,'maximum')]+1;
			     }
			     else
			     {
				detectionHash[(result.codeResult.code,'maximum')]=1;
			     }

			 }
			 if (median <=0.01){ //la idea es que se pueda tomar un criterio cuando la mediana es mayor.
				 if (detectionHash[(result.codeResult.code,'normal')]>=1){
					detectionHash[(result.codeResult.code,'normal')]=detectionHash[(result.codeResult.code,'normal')]+1;
				 }
				 else
				 {
					detectionHash[(result.codeResult.code,'normal')]=1;
				 }
			 }
		}

                if(detectionHash[(result.codeResult.code,'median')] >= 5 || detectionHash[(result.codeResult.code,'maximum')]>=2 || 
		   detectionHash[(result.codeResult.code,'mean')]>=10 || detectionHash[(result.codeResult.code,'normal')]>=20) {
                    detectionHash = {};
                    var last_code = result.codeResult.code;
                    Quagga.stop();
	            document.getElementById('cerrar').style.display = 'none';
                    leerBaseDatos(last_code);
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
                },locate: true,            
		locator: {
                patchSize: "medium",
                halfSample: true
            },
                decoder: {
                    readers : ["code_128_reader","ean_reader","ean_8_reader","code_39_reader","code_39_vin_reader","codabar_reader","upc_reader","upc_e_reader","i2of5_reader","2of5_reader","code_93_reader"]
                },  debug: {
      drawBoundingBox: true,
      showFrequency: false,
      drawScanline: true,
      showPattern: false
  }
              },function(err) {
                  if (err) { console.log(err); return }
                  Quagga.initialized = true;
                  Quagga.start();
              });

            

          }
