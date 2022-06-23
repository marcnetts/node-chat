var net = require('net');

var PORTA = 3000;
var connections = [];

var broadcast = function (message, origin, includeOrigin) {
  console.log(message);
  connections.forEach(function (connection) {
    if (!includeOrigin && connection === origin) return;
    connection.write(message);
  });
};

var connect = function(port){
  console.log(`Iniciando servidor na porta ${port}...`);
  net.createServer(function (connection) {
    var conexaoJaExistente = connections.filter(x => x.remoteAddress === connection.remoteAddress);
    connection.nickname = conexaoJaExistente.length ? conexaoJaExistente[0].nickname : connection.remoteAddress;
    
    connections.push(connection);
    connection.write('Bem-vindo ao servidor! Digite /help para ver os comandos disponíveis.\n');
    connection.on('data', function (message) {
      var command = message.toString();
      if (command.indexOf('/help') === 0) {
        connection.write("/help: Exibe comandos do servidor. \
        \n/nickname <nome>: Substitui seu nickname. \
        ");
        return;
      }
      else if (command.indexOf('/nickname') === 0) {
        var nickname = command.replace('/nickname ', '');
        if (nickname == '' || nickname == ' ') connection.write('Nenhum nome digitado.');
        else{
          broadcast(connection.nickname + ' mudou seu nick para ' + nickname);
          connection.nickname = nickname;
        }
        return;
      }
      broadcast(connection.nickname + ' > ' + message, connection, true);
    });
    connection.on('end', function () {
      broadcast(connection.nickname + ' se desconectou do chat.', connection, false);
      connections.splice(connections.indexOf(connection), 1);
    });
    connection.on('error', function () {
      broadcast(connection.nickname + ' saiu por um erro.', connection, false);
      connections.splice(connections.indexOf(connection), 1);
    });
  }).listen(port);
}

if (require.main === module) {
  connect(PORTA);
}

module.exports.connect = connect;