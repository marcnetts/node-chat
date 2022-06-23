var net = require('net');

var PORTA = 3000;

var connect = function(port){
  console.log(`Iniciando cliente na porta ${port}...`);
  var client = net.connect({host: '127.0.0.1' , port: port});
  client.on('connect', function(message){
    client.write('<Se conectou ao chat>');
  });
  client.on('data', function(message){
    console.log(message.toString());
  });
  client.on('end', function () {
    console.log('A conexão com o servidor foi encerrada.');
    process.exit();
  });
  client.on('error', function () {
    console.log('A conexão com o servidor foi perdida.');
    process.exit();
  });

  process.stdin.on('readable', function(){
    while (data = this.read()) {
      if (!!data){
        var messageParsed = data.toString().replace(/\r/, '').replace(/\n/, '');
        client.write(messageParsed);
      }
    }
  });
}

if (require.main === module) {
  connect(PORTA);
}

module.exports.connect = connect;