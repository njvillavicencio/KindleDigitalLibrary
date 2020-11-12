

      function cargarCliente() {
        gapi.load('client:auth2', iniciarCliente);
      }
       
      function iniciarCliente() {
        gapi.client.init({
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
              
          gapi.client.drive.files.list({
          spaces: 'appDataFolder',
          fields: 'files(id,name)'
        }).then(function(response) {
          var archivos = response.result.files;
          if (archivos && archivos.length > 0) {
            var archivo = archivos[0];
            obtenerArchivo(archivo.name);
	        idArchivo=archivo.name;
          }    
         else {
		    crearArchivo();
	      }
        });    
              
              
              
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          document.getElementById('desconectar').onclick = desconectarCliente;
          document.getElementById('continuar').onclick = autentificacionCliente;   
        });
      }

      function autentificacionCliente(event) {
        initialized=true;
        gapi.auth2.getAuthInstance().signIn({ux_mode: "redirect"});
      }

      function deslogeoCliente(event) {
        gapi.auth2.getAuthInstance().signOut().then(function () {
          location.reload();
        }); 
      }

      function desconectarCliente(event) {
        gapi.auth2.getAuthInstance().disconnect().then(function () {
          deslogeoCliente();
        });
      } 
