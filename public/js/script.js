$(function() {
  function verificar() {
    $.get("/verificar/session").done(function() {
      alert("Usuário logado!");
    }).fail(function() {
      alert("Usuário deslogado!");
    });
  }

  $('#verificar').click(function(event) {
    event.preventDefault();
    verificar();
  });

});
