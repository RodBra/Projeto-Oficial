#include <SimpleDHT.h>

int pinDHT11 = 2;
SimpleDHT11 dht11(pinDHT11);

void setup() {
  Serial.begin(115200);
}

void loop() {
  
  byte t = 0;
  byte h = 0;
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read(&t, &h, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Erro ao ler dados do DHT11 com Arduino, erro: "); 
    Serial.println(err);
    delay(1000);
    return;
  }
  

  Serial.print((int)t); 
  Serial.print(":"); 
  Serial.print((int)h);
  
  delay(2000);
}
