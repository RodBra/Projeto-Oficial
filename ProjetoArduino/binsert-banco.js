// leitura dos dados do Arduino
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


class ArduinoDataRead {

    constructor(){
        this.listData = [];
    }

    get List() {
        return this.listData;
    }

    SetConnection(){
		
		

        SerialPort.list().then(listSerialDevices => {
            
            let listArduinoSerial = listSerialDevices.filter(serialDevice => {
                return serialDevice.vendorId == 2341 && serialDevice.productId == 43;
            });
            
            if (listArduinoSerial.length != 1){
                throw new Error("The Arduino was not connected or has many boards connceted");
            }

            console.log("Arduino found in the com %s", listArduinoSerial[0].comName);
             
            return  listArduinoSerial[0].comName;
            
        }).then(arduinoCom => {
            
            let arduino = new SerialPort(arduinoCom, {baudRate: 9600});
            
            const parser = new Readline();
            arduino.pipe(parser);
            
            
            parser.on('data', (data) => {
				//connection.on('connect', function (err) {
	//				if (!err) {
						console.error('recebeu do arduino! '+data);
						//var leitura = data.split(';'); // temperatura ; umidade
						//console.error(leitura);
						//console.error('-'+leitura[1].replace('\r','')+'-');
						//registrarLeitura(Number(leitura[0]), Number(leitura[1]));		
		//			}
				//});
            });
            
        }).catch(error => console.log(`Erro ao receber dados do Arduino ${error}`));
    } 
}

const serial = new ArduinoDataRead();

//while (true) { 
	serial.SetConnection();
//}

module.exports.ArduinoData = {List: serial.List} 
