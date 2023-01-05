# generar-tripletas
Script para generar tripletas de facturas para Factoring, actualmente con tipo, cliente y otros datos hardcodeados, tal vez algún día los parametrice :)

## Instalar dependencias
```
npm install
```

## Generar tripletas
```
node generar-tripletas.js {ultimoFolioFactura} {numeroDeTripletas}
```
Donde `ultimoFolioFactura` es el folio de la última factura generada, y `numeroDeTripletas` corresponde a la cantidad de tripletas a generar. Por ejemplo, para generar cinco tripletas y donde la última factura anteriormente generada es la 3063:
```
node generar-tripletas.js 3063 5
```
Y se generaran cinco tripletas con facturas con folio desde 3064.