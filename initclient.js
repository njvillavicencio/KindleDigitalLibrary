

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
                            console.log('hola');
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
