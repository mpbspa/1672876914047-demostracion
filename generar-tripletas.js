const fs = require('fs');
const archiver = require('archiver');

let args = [];

process.argv.forEach(function (val, index, array) {
    args.push(val);
});

let numeroTripletas = args[3] ? parseInt(args[3]) : 1;
let numeroFactura = args[2] ? parseInt(args[2]) : 1234;

function formatoFecha(fecha) {
    const yyyy = fecha.getFullYear();
    let mm = fecha.getMonth() + 1;
    let dd = fecha.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const fechaFormateada = dd + '-' + mm + '-' + yyyy;
    return fechaFormateada;
}

async function generarFacturas(i) {
    setTimeout(async function () {
        let fecha = new Date();
        let fechaSinGuiones = fecha.toISOString().split("T")[0].split(/-/).join("");
        let hora = fecha.toISOString().split("T")[1].split(".")[0].split(":").join("");
        let fechaConGuiones = formatoFecha(fecha);
        const nombre = `NOMINADTES_${fechaSinGuiones}${hora}_34113`;


        // Cuatro facturas
        const datData = `76105135-096669520-K033000000000000${numeroFactura + 1}${fechaConGuiones}01-01-200000000000008876670000000000034721DTE       0
76105135-096669520-K033000000000000${numeroFactura + 2}${fechaConGuiones}01-01-200000000000019465890000000000034721DTE       0
76105135-096669520-K033000000000000${numeroFactura + 3}${fechaConGuiones}01-01-200000000000014743010000000000034721DTE       0
76105135-096669520-K033000000000000${numeroFactura + 4}${fechaConGuiones}01-01-200000000000016609890000000000034721DTE       0`;

        // Una factura
        // const datData = `76105135-096669520-K033000000000000${numeroFactura + 1}${fechaConGuiones}01-01-200000000000008876670000000000034721DTE       0`;

        // Cuatro facturas
        const controlData = `76105135-0${nombre}.dat               ${nombre}.zip               00004000040000000005969546
033000040000000005969546
        `;

        // Una factura
        //         const controlData = `76105135-0${nombre}.dat               ${nombre}.zip               00004000040000000000887667
        // 033000040000000000887667
        // `;

        try {
            // Crear directorio
            await fs.promises.mkdir("tripletas", { recursive: true });

            // Crear .dat
            // await fs.promises.writeFile(`tripletas/${nombre}.dat`, datData);

            // Crear .ctl
            // await fs.promises.writeFile(`tripletas/${nombre}.ctl`, controlData);

            // Leer XML 1
            let xml1 = await fs.promises.readFile(`xml/76105135-0_33_folio1_DTE.xml`);
            let newXml1 = xml1.toString().split("folio1").join((numeroFactura + 1).toString());

            // Leer XML 2
            let xml2 = await fs.promises.readFile(`xml/76105135-0_33_folio2_DTE.xml`);
            let newXml2 = xml2.toString().split("folio2").join((numeroFactura + 2).toString());

            // Leer XML 3
            let xml3 = await fs.promises.readFile(`xml/76105135-0_33_folio3_DTE.xml`);
            let newXml3 = xml3.toString().split("folio3").join((numeroFactura + 3).toString());

            // Leer XML 4
            let xml4 = await fs.promises.readFile(`xml/76105135-0_33_folio4_DTE.xml`);
            let newXml4 = xml4.toString().split("folio4").join((numeroFactura + 4).toString());

            // Crear .zip
            let output = fs.createWriteStream(`tripletas/${nombre}.zip`);
            let archive = archiver('zip');

            output.on('close', function () {
                console.log(nombre);
            });
            archive.on('error', function (err) {
                throw err;
            });
            archive.pipe(output);

            // Agregar archivos a .zip
            archive.append(newXml1, { name: `76105135-0_33_${numeroFactura + 1}_DTE.xml` });
            archive.append(newXml2, { name: `76105135-0_33_${numeroFactura + 2}_DTE.xml` });
            archive.append(newXml3, { name: `76105135-0_33_${numeroFactura + 3}_DTE.xml` });
            archive.append(newXml4, { name: `76105135-0_33_${numeroFactura + 4}_DTE.xml` });

            await archive.finalize();

            // Crear paquete
            let paquete = fs.createWriteStream(`tripletas/PAQUETE_${nombre}.zip`);
            let archive2 = archiver('zip');

            paquete.on('close', function () {
                // console.log(archive.pointer() + ' bytes totales');
                // console.log(`tripletas/${nombre}.zip ha sido creado`);
            });
            archive2.on('error', function (err) {
                throw err;
            });
            archive2.pipe(paquete);

            // Agregar archivos a paquete
            archive2.append(datData, { name: `${nombre}.dat` });
            archive2.append(controlData, { name: `${nombre}.ctl` });
            archive2.file(`tripletas/${nombre}.zip`, { name: `${nombre}.zip` });

            await archive2.finalize();

            // Eliminar .zip
            await fs.promises.rmdir(`tripletas/${nombre}.zip`, { recursive: true, force: true });

            // Offset (== cantidad de facturas por tripleta)
            // numeroFactura += 4;
            numeroFactura += 4;


        } catch (error) {
            console.log("ERROR!", error);
        }
    }, 2000 * i);
}

(async () => {
    // Remover tripletas creadas
    await fs.promises.rmdir("tripletas", { recursive: true, force: true });
    for (let i = 0; i < numeroTripletas; i++) {
        await generarFacturas(i);
    }
})();