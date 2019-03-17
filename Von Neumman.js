//Array para llenar la tabla de memoria
let memoria = [/* Aqui van las instrucciones */ ['000010000001','010010000010','100010000111','001010000000','000010000011','001010000100',
                                            '100010001000','001010000000','000010000111','000110001000','100010001001','001010000000',
                                            '000010000101','010010000110','000010001001','100010001010','100100000000'],
            /* Aqui van los datos*/ ['000000000000','000000001001','000000000011','000000001011','000000000111','000000001100','000000000010']];

//Array para llenar el decodificador
let decodificador = [/* Instrucciones */ ['0000','0001','0010','0011','0100','0101','0110','0111','1000','1001'],
                     /* Operaciones */ ['+','-','*','/','^','&','|','⊕','M','F'],
                     /* Comentarios */ ['Suma','Resta','Producto','Cociente','Potencia','Operador AND',
                                        'Operador OR','Operador XOR','Mover a Memoria', 'Finalizar']];

//Clase que representa el decodificador
class Decodificador{
    
    constructor(decodificador){
        this.instr = decodificador;
    }
    
    //Se obtiene la operacion de acuerdo al nibble que sea pasado como parametro, en caso de que exista y se resalta
    obtenerO = (binario) => {
        let it = this.instrucciones;
        for(let i = 0; i < it.length; i++){
            if(it[i] == binario){
                let tr = document.getElementById("tr"+i);
                tr.classList.add("resaltar");
                return this.operaciones[i];
            }
        }
        return false;
    }
    
    //Se crea una fila (tr) por cada array y luego a cada fila se agregan los datos (td) de instruccion, operacion y contenido.
    llenar = () => {
        
        var table = document.getElementById("decoT");
        
        for(let i = 0; i < this.instr[0].length; i++){
            let tr = document.createElement("tr");
            tr.id = "tr"+i;
            for(let j = 0; j < this.instr.length; j++){
                let arr = this.instr[j];
                let tx = document.createTextNode(arr[i]);
                let td = document.createElement("td");
                td.append(tx);
                tr.append(td);
            }
            table.append(tr);
        }
    }
    
    get instrucciones(){
        return this.instr[0];
    }

    get operaciones(){
        return this.instr[1];
    }

    get comentario(){
        return this.instr[2];
    }

}

//Clase que representa la memoria
class Memoria{
    
    constructor(contenido){
        
        //Representa todos los datos e instrucciones
        this.all = contenido;
        
        /*
        Se llena en el constructor asignando en orden un byte a cada binario del contenido, teniendo en cuenta que a partir del contenido 128 los binarios corresponden a los datos.
        */
        this.content = new Map();
        
        //Llenado del mapa con las instrucciones
        this.instrucciones.forEach((inst, index) => {
            this.content.set(toBin(index, true), inst);
        });
        
        //Llenado del mapa con los datos
        this.datos.forEach((data, index) => {
            this.content.set(toBin(index + 128, true), data);
        })
        
        //Se agregan las direcciones disponibles para guardar informacion
        let direccion = 0;
        for(let key of this.content.keys()){
            if(key.charAt(0) == "1"){
                direccion++;
            }
        }
        
        for(let i = 0; i < 4; i++ ){
            this.content.set(toBin(direccion + 128, true), null);
            direccion++;
        }
        
    }
    
    //Se insertan todos los datos en las divisiones correspondientes
    llenar = () => {
        
        //Se llaman a todas las divisiones correspondientes
        var dirI = document.getElementById("direccionesI"); 
        var conI = document.getElementById("contenidoI"); 
        var dirD = document.getElementById("direccionesD"); 
        var conD = document.getElementById("contenidoD"); 
        
        //Se crean los elementos nodos hijos y se agregan a los nodos padres correspondientes
        this.content.forEach((value, key) => {
            
            //Se crean los nodos de texto para la direccion (key) y para el contenido en esa direccion (value)
            let txd = document.createTextNode(key);
            let txc = document.createTextNode(value);
            
            //Se crea una division para la direccion (dd) y para el contenido en esa direccion (dc)
            let dd = document.createElement("div");
            dd.id = key;
            let dc = document.createElement("div");
            dc.id = value + key;
            
            //Se agrega el nodo de texto a la division correspondiente, el estilo de width se aplica para responsividad
            dd.append(txd);
            dd.style.width = "0px";
            dc.append(txc);
            dc.style.width = "0px";
            
            /*
            Se verifica si el par clave-valor es de instrucciones o de datos mediante el primer bit de la direccion y se agregan las divisiones previamente creadas a la division padre correspondiente si no son nulas.
            */
            if(key.charAt(0) == '0'){
                dirI.append(dd);
                conI.append(dc);
            }else{
                dirD.append(dd);
                if(value != null){
                    conD.append(dc);
                }
            }
            
        });   
        
    }
    
    //Se almacena un dato en la memoria
    agregar = (direccion, contenido) => {
        
        //Se llaman a todas las divisiones correspondientes
        var conD = document.getElementById("contenidoD");
        
        this.content.set(direccion, contenido);
        
        //Se crea el nodo de texto para el contenido en esa direccion
        let txc = document.createTextNode(contenido);
        
        //Se crea una division para el contenido en esa direccion (dc)
        let dc = document.createElement("div");
        dc.id = contenido + direccion;
        dc.classList.add("resaltar");

        //Se agrega el nodo de texto a la division correspondiente, el estilo de width se aplica para responsividad
        dc.append(txc);
        dc.style.width = "0px";
        
        //Se adjuntan las divisiones a la division de datos
        conD.append(dc);
        
    }
    
    //Se obtiene el contenido de acuerdo a la direccion en el parametro y se resalta
    buscar = (direccion, pulso) => {
        let contenido = this.content.get(direccion);
        document.getElementById(direccion).classList.add("resaltar");
        if(contenido != null){
            document.getElementById(contenido+direccion).classList.add("resaltar");
        }
        return contenido;
        
    }
    
    //Se obtienen todas las instrucciones del parametro constructor
    get instrucciones(){
        return this.all[0];
    }
    
    //Se obtienen todos los datos del parametro constructor
    get datos(){
        return this.all[1];
    }
    
}

//Clase que representa toda la funcionalidad
class VonNeumman{
    
    constructor(memoria, decodificador){
        
        //Representan cada pulso de clock
        this.pulsos = 0;
        
        //Representan cada paso en cada pulso, si se ejecuta secuencial
        this.pasos = 0;
        
        //Datos requeridos en cada pulso de clock
        this.instruccion = "";
        this.operacion = "";
        this.direccion = "";
        this.contenido = "";
        this.dato = "";
        
        //Componentes del procesador
        this.memoria = new Memoria(memoria);
        this.decodificador = new Decodificador(decodificador);
        this.contador = new Registro("clock");
        this.registroDirecciones = new Registro("datosRD");
        this.registroInstrucciones = new Registro("datosRI");
        this.registroDatos = new Registro("datosRDa");
        this.registroEntrada = new Registro("datosRE");
        this.acumulador = new Registro("datosA");
        
        //Metodos para inicializar
        this.llenarTablas();
        this.registroEntrada.agregarB("000000000000");
        this.acumulador.agregarB("000000000000");
        
    }
    
    llenarTablas = () => {
        this.memoria.llenar();
        this.decodificador.llenar();
    }
    
    //Se ejecuta todo, por cada pulso de reloj se ejecuta un paso de la operacion
    desplazarSecuencial = () => {
        
        //Se pasa el pulso a binario
        this.pulsoBinario = toBin(this.pulsos, true);
        
        //Esta linea elimina el resaltado en el decodificador y en la memoria
        Array.from(document.getElementById("decoT").getElementsByClassName("resaltar")).forEach(tr => { tr.classList.remove("resaltar") });
        Array.from(document.getElementById("contenido").getElementsByClassName("resaltar")).forEach(tr => { tr.classList.remove("resaltar") });   
        
        //Para mostrar de manera secuencial por pulso, en cada pulso se resetea o incrementa el contador de pasos.
        switch(this.pasos){
            case 0: 
                //1. Se agrega el pulso del contador
                this.contador.agregarB(this.pulsoBinario, true);
                this.pasos++;
                break;
            case 1:
                //2. Se pasa el pulso del contador al Registro de Direcciones
                let pContador = this.contador.getRegistro(this.pulsos);
                this.registroDirecciones.agregarB(pContador);
                this.pasos++;
                break;
            case 2:
                //3. Se obtiene el contenido (instruccion) correspondiente a ese pulso desde la memoria
                this.contenido = this.memoria.buscar(this.pulsoBinario);
                this.pasos++;
                break;
            case 3:
                //4. Se pasa el contenido al Registro de Datos
                this.registroDatos.agregarB(this.contenido);
                this.pasos++;
                break;
            case 4:
                //5. Se obtienen los cuatro primeros bits y se pasan al Registro de Instrucciones
                this.instruccion = this.contenido.slice(0, 4);
                this.registroInstrucciones.agregarB(this.instruccion, true);
                this.pasos++;
                break;
            case 5:
                //6. Se resalta y obtiene operacion que se va a realizar. 
                this.operacion = this.decodificador.obtenerO(this.instruccion);
                this.pasos++;
                break;
            case 6:
                //7. Se pasa el byte del contenido al Registro de Direcciones
                this.direccion = this.contenido.slice(4, 12);
                this.registroDirecciones.agregarB(this.direccion, true);
                
                /*
                Se obtiene el contenido (dato) a partir del byte anterior si es aritmetica o logica si no, se saltan los siguientes se verifica si es Mover a Memoria o Finalizar.
                Si es Mover a memoria, se salta al paso 11.
                Si es Finalizar, se salta al paso 10.
                Si es artimetica o logica, se hacen los 3 siguientes pasos.
                */
                if(this.operacion != 'M' && this.operacion!= 'F'){
                    this.dato = this.memoria.buscar(this.direccion);
                    this.pasos++;
                }else{
                    if(this.operacion == 'F'){
                        this.pasos = 10;
                    }else{
                        this.pasos = 11;
                    }
                }
                
                break;
            case 7:
                //8. Se pasa el dato al registro de datos, si es artimetica o logica
                this.registroDatos.agregarB(this.dato, true); 
                this.pasos++;
                break;                
            case 8:
                //9. Se agrega el dato al registro de Entrada
                this.registroEntrada.agregarB(this.dato, true);
                this.pasos++;
                break;
            case 9:
                //10. Se hace la operacion correspondiente (Aritmetica o Logica), se agrega al acumulador, se reinicia el contador de pasos y se incrementan los pulsos
                let num1 = toDec(this.acumulador.getRegistro(this.pulsos));
                let num2 = toDec(this.registroEntrada.getRegistro(this.registroEntrada.datos.length - 1));
                let resultado = "";
                switch(this.operacion){
                    case '+':    
                        resultado = toBin(num1 + num2, false, true);
                        break;
                    case '-':
                        resultado = toBin(num1 - num2, false, true);
                        break;
                    case '*':
                        resultado = toBin(num1 * num2, false, true);
                        break;
                    case '/':
                        resultado = toBin(num1 / num2, false, true);
                        break;
                    case '^':
                        resultado = toBin(num1 ** num2, false, true);
                        break;
                    case '&':
                        resultado = toBin(num1 & num2, false, true);
                        break;
                    case '|':
                        resultado = toBin(num1 | num2, false, true);
                        break;
                    case '⊕':
                        resultado = toBin(num1 ^ num2, false, true);
                        break;                     

                }
                //console.log(`${num1} ${this.operacion} ${num2} = ${toDec(resultado)}`);
                this.acumulador.agregarB(resultado, true);
                this.pasos = 0;
                this.pulsos++;
                break;
            case 10:
                //10. Se hace la operacion correspondiente (Mover a Memoria o Finalizar)
                //Finalizar         
                //Se resalta la primera posicion que es en la cual se deja el cursor al finalizar
                let dato = this.memoria.buscar(this.direccion);

                //Se finalizan los pulsos
                clearInterval(interval);
                break;
            case 11:
                //Mover a memoria 1
                //Se repite el ultimo dato en el acumulador      
                this.acumulador.agregarB(this.acumulador.getRegistro(this.acumulador.datos.length - 1), true);
                this.pasos++;
                break;
            case 12:
                //Mover a memoria 2
                //Se pasa al Registro de Datos el ultimo dato en el acumulador
                this.registroDatos.agregarB(this.acumulador.getRegistro(this.acumulador.datos.length - 1), true); 
                this.pasos++;
                break;
            case 13:
                //Mover a memoria 3
                //Se guarda en la memoria ese dato en la posicion indicada en la direccion, se reinician los pasos y se incrementan los pulsos
                this.memoria.agregar(this.direccion, this.acumulador.getRegistro(this.acumulador.datos.length - 1));
                this.pasos = 0;          
                this.pulsos ++;
                break;
          
        }
        
    }
    
    //Se ejecuta todo, por cada pulso de reloj se ejecuta toda la operacion
    desplazarDirecto = () => {
        
        //Esta linea elimina el resaltado en el decodificador y en la memoria
        Array.from(document.getElementById("decoT").getElementsByClassName("resaltar")).forEach(tr => { tr.classList.remove("resaltar") });
        Array.from(document.getElementById("contenido").getElementsByClassName("resaltar")).forEach(tr => { tr.classList.remove("resaltar") });
        
        let pulsoBinario = toBin(this.pulsos, true);
        
        //1. Se agrega el pulso del contador
        this.contador.agregarB(pulsoBinario, true);
        
        //2. Se pasa el pulso del contador al Registro de Direcciones
        let pContador = this.contador.datos[this.pulsos];
        this.registroDirecciones.agregarB(pContador);
        
        //3. Se obtiene el contenido (instruccion) correspondiente a ese pulso desde la memoria
        let contenido = this.memoria.buscar(pulsoBinario);
        
        //4. Se pasa el contenido al Registro de Datos
        this.registroDatos.agregarB(contenido);
        
        //5. Se obtienen los cuatro primeros bits y se pasan al Registro de Instrucciones
        let instruccion = contenido.slice(0, 4);
        this.registroInstrucciones.agregarB(instruccion, true);
        
        //Se resalta y obtiene operacion que se va a realizar. 
        let operacion = this.decodificador.obtenerO(instruccion);
        
        //Se pasa el byte del contenido al Registro de Direcciones
        let direccion = contenido.slice(4, 12);
        this.registroDirecciones.agregarB(direccion, true);
        
        //Se obtiene el contenido (datos) a partir del byte anterior
        let dato = this.memoria.buscar(direccion);
        
        //6. Se verifica la operacion, si es aritmetica o logica, se agrega el dato al Registro de Datos y de Entrada
        if(operacion != 'M' && operacion!= 'F'){
            this.registroDatos.agregarB(dato, true);
            this.registroEntrada.agregarB(dato, true);
            
            //7. Se hace la operacion correspondiente si es aritmetica o logica
            let num1 = toDec(this.acumulador.getRegistro(this.pulsos, true));
            let num2 = toDec(dato);
            let resultado = "";
            switch(operacion){
                case '+':    
                    resultado = toBin(num1 + num2, false, true);
                break;
                case '-':
                    resultado = toBin(num1 - num2, false, true);
                break;
                case '*':
                    resultado = toBin(num1 * num2, false, true);
                break;
                case '/':
                    resultado = toBin(num1 / num2, false, true);
                break;
                case '^':
                    resultado = toBin(num1 ** num2, false, true);
                break;
                case '&':
                    resultado = toBin(num1 & num2, false, true);
                    break;
                case '|':
                    resultado = toBin(num1 | num2, false, true);
                    break;
                case '⊕':
                    resultado = toBin(num1 ^ num2, false, true);
                    break; 
                    
            }
            this.acumulador.agregarB(resultado, true);
            
        }else{
            
            //7. Se hace la operacion de Mover a Memoria o Finalizar
            if(operacion == 'M'){
                
                //Mover a memoria
                
                let lastDato = this.acumulador.datos[this.acumulador.datos.length - 1];
                
                this.acumulador.agregarB(lastDato, true);

                //Se pasa al Registro de Datos el ultimo dato en el acumulador
                this.registroDatos.agregarB(lastDato, true);
                
                //Se guarda en la memoria ese dato en la posicion indicada en la direccion
                this.memoria.agregar(direccion, lastDato);
                
            }else{
                
                //Finalizar
                
                //Se resalta la primera posicion que es en la cual se deja el cursor al finalizar
                let dato = this.memoria.buscar(direccion);
                
                //Se finalizan los pulsos
                clearInterval(interval);
                
            }            
            
            
        }
        
        this.pulsos ++;
        
    }
    
}

//Clase que representa los componentes por donde pasan los binarios
class Registro{
    
    constructor(divName){
        
        this.datos = [];    
        this.divName = divName;
        
    }
    
    /*
    El parametro end indica si el binario que se va agregar es o no el ultimo del pulso para ese registro, en caso de ser true, se dibuja un borde inferior en la division para diferenciar los datos que se pasan en cada pulso. 
    */
    agregarB = (binario, end = false) => {
        
        this.datos.push(binario);
        let div = document.getElementById(this.divName);
        let txt = document.createTextNode(binario);
        let ndiv = document.createElement('div');
        ndiv.append(txt);
        
        if(end){
            ndiv.style.borderBottom = "2px solid white";
        }
        
        div.append(ndiv);
        
    }
    
    getRegistro = (index) => {
        return this.datos[index];
    }
    
}



//Se instancia y ejecuta la funcionalidad de la clase VonNeumman el numero del segundo parametro representa el tiempo que dura cada pulso en ms
var vn = new VonNeumman(memoria, decodificador);
var interval = setInterval(vn.desplazarDirecto, 500);


//Funciones para conversion Binario-Decimal
function toDec(binario){
    return parseInt(binario, 2);
}

/*
Funcion para conversion Decimal-Binario
- Si solo se escribe un parametro devuelve un nibble
- Si se escribe tambien el segundo parametro como (true), devuelve un byte
- Si se escribe el segundo parametro como (false), y el tercero como (true), devuelve un binario de doce bits
*/
function toBin(dec, byte = false, doce = false){
    let n = Number(dec).toString(2);
    if(byte){
        return "00000000".substr(n.length) + n;
    }
    if(doce){
        return "000000000000".substr(n.length) + n;
    }
    return "0000".substr(n.length) + n;
}