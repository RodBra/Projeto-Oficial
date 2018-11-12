#include <DHT.h>
#include <Adafruit_Sensor.h>

#define DHTPIN A0
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  if (isnan(t) || isnan(h)) {
    Serial.println("Erro ao ler dados do DHT11 com Arduino");
  } else {
  Serial.print(t);
  Serial.print(":");
  Serial.println(h);   
  }
    
  delay(2000);
}
