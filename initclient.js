

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
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          document.getElementById('desconectar').onclick = desconectarCliente;
          document.getElementById('continuar').onclick = autentificacionCliente;   
        });
      }

      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {   
          document.getElementById('continuar').onclick = window.location.href="dashboard.html"; 
          document.getElementById('desconectar').style.display = 'block';
        } 
        else {
          document.getElementById('desconectar').style.display = 'none';
        }
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