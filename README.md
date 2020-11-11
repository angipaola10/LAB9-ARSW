### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW

## Integrantes

* Angi Paola Jimenez Pira
* Sergio Alejandro Bohorquez Alzate

## Escalamiento en Azure con Maquinas Virtuales, Sacale Sets y Service Plans

### Dependencias
* Cree una cuenta gratuita dentro de Azure. Para hacerlo puede guiarse de esta [documentación](https://azure.microsoft.com/en-us/free/search/?&ef_id=Cj0KCQiA2ITuBRDkARIsAMK9Q7MuvuTqIfK15LWfaM7bLL_QsBbC5XhJJezUbcfx-qAnfPjH568chTMaAkAsEALw_wcB:G:s&OCID=AID2000068_SEM_alOkB9ZE&MarinID=alOkB9ZE_368060503322_%2Bazure_b_c__79187603991_kwd-23159435208&lnkd=Google_Azure_Brand&dclid=CjgKEAiA2ITuBRDchty8lqPlzS4SJAC3x4k1mAxU7XNhWdOSESfffUnMNjLWcAIuikQnj3C4U8xRG_D_BwE). Al hacerlo usted contará con $200 USD para gastar durante 1 mes.

### Parte 0 - Entendiendo el escenario de calidad

Adjunto a este laboratorio usted podrá encontrar una aplicación totalmente desarrollada que tiene como objetivo calcular el enésimo valor de la secuencia de Fibonnaci.

**Escalabilidad**
Cuando un conjunto de usuarios consulta un enésimo número (superior a 1000000) de la secuencia de Fibonacci de forma concurrente y el sistema se encuentra bajo condiciones normales de operación, todas las peticiones deben ser respondidas y el consumo de CPU del sistema no puede superar el 70%.

### Escalabilidad Serverless (Functions)

1. Cree una Function App tal cual como se muestra en las  imagenes.

    ![](images/part3/part3-function-config.png)

    ![](images/part3/part3-function-configii.png)

2. Instale la extensión de **Azure Functions** para Visual Studio Code.

    ![](images/part3/part3-install-extension.png)

3. Despliegue la Function de Fibonacci a Azure usando Visual Studio Code. La primera vez que lo haga se le va a pedir autenticarse, siga las instrucciones.

    ![](images/part3/part3-deploy-function-1.png)

    ![](images/part3/part3-deploy-function-2.png)

4. Dirijase al portal de Azure y pruebe la function.

    ![](images/part3/part3-test-function.png)

5. Modifique la coleción de POSTMAN con NEWMAN de tal forma que pueda enviar 10 peticiones concurrentes. Verifique los resultados y presente un informe.

    # Informe
    
    Modificamos la colección de postman para poder enviar las peticiones concurrentemente, además creamos un environment de postman en el cual almacenamos la url de la Azure function.
    
    Colección de postman
    
    ![](/images/part2/postman.png)
    
    Environment de postman
    
    ![](/images/part2/postman2.png)
    
    Para enviar las peticiones concurrentes se simuló el uso de la función a través de varios clientes conectados, en un entorno real se podría hacer uso de herramientas como BlazeMeter o Jmeter.
    
    ![](/images/part2/ejecucion.png)
    
    Al enviar 10 peticiones concurrentes se obtuvo un tiempo de respuesta promedio de 1.88 minutos:
    
    ![](/images/part2/tiempo.png)
    
    Observamos que todas las peticiones se resolvieron exitosamente.
    
    ![](/images/part2/peticiones.png)
    
    El espacio de trabajo en memoria promedio fue de 83.58MB con un total de 10 request.
    
    ![](/images/part2/memoria.png)
    
    Haciendo uso de la herramienta de App Insights y la herramienta live metrics podemos observar que el consumo promedio de cpu es de un 100%, lo cual contradice el atributo de escalabilidad definido en la parte 0 de este laboratorio. Se notó que se estaba haciendo uso de 4 instancias de servidor.
    
    ![](/images/part2/cpu.png)
    
    **Conclusiones:**
    
    * En general se cumplió con el requerimiento de escalabilidad ya que pudimos observar que las peticiones concurrentes de gran tamaño fueron resueltas correctamente por el servidor y a medida que las peticiones se iban realizando el número de servidores online para la Azure Function aumentaba (según live metrics), lo cual permite observar elasticidad en la infraestructura.
    
    * El consumo de Cpu superó en algún momento el 70% por lo cual no se logró cumplir totalmente con este requerimiento documentado.
    
    * Aunque la implementación es ineficiente, gracias a la infraestructura serverless se logró responder a todas las peticiones del cliente, existe un consumo alto de recursos de tiempo y de cpu.

6. Cree una nueva Function que resuelva el problema de Fibonacci pero esta vez utilice un enfoque recursivo con memoization. Pruebe la función varias veces, después no haga nada por al menos 5 minutos. Pruebe la función de nuevo con los valores anteriores. ¿Cuál es el comportamiento?.

    Se implementó la función recursivamente con memoización utilizando un map como estructura de datos para guardar las respuestas y no tener cálculos repetidos.
    
    ![](https://media.discordapp.net/attachments/352624122301513730/775542283323572224/unknown.png?width=474&height=475)
    
    Podemos observar el comportamiento de los tiempos de respuesta, observamos que son mucho más bajos comparados con la anterior implemtanción, al principio son más altos debido a que no hay respuestas en memoria, pero va mejorando a medida que se realizan más peticiones, esto se debe a que se guardan respuestas anteriores en memoria.
    
    ![](https://media.discordapp.net/attachments/352624122301513730/775543745155956736/unknown.png)
    
    Después de 5 minutos el tiempo de respuesta a las peticiones incrementó nuevamente debido a que transcurridos 5 minutos de inactividad de la función los datos almacenados en memoria se limpian automáticamente y es necesario volver a hacer calculos que ya se tenian. esto se debe al plan seleccionado (Consumption).
    
    ![](https://media.discordapp.net/attachments/352624122301513730/775547139237216256/unknown.png)
    
    

**Preguntas**

* **¿Qué es un Azure Function?**

    **Azure Function** es un servicio *serverless*, una solución que nos permite ejecutar fácilmente pequeños fragmentos de código o funciones en la nube, esto hace que solamente nos tengamos que preocupar por desarrollar la funcionalidad que necesitamos, sin importar la aplicación o la infraestructura para ejecutarlo. Se pueden implementar en varios lenguajes (JavaScript, C#, Python, PHP, etc.), así como en opciones de scripting como Bash, Batch y PowerShell, además, permite codificar tanto en el portal de Azure como en nuestra aplicación y luego integrarla configurando la integración continua en Azure. 

   Azure function se basa en escala y bajo demanda, por lo que solo se paga por los recursos consumidos; se factura según el número total de ejecuciones solicitadas cada mes para todas las funciones. Las ejecuciones se cuentan cada vez que se ejecuta una función en respuesta a un evento, desencadenado por un enlace. El primer millón de ejecuciones es gratis cada mes.

* **¿Qué es serverless?**
    
    **Serverless**, en español "*sin servidor*", es un tipo de arquitectura en el que no se utilizan servidores (físicos o en la nube), sino que se asigna la responsabilidad de ejecutar un fragmento de código a un proovedor de la nube (AWS, Azure, Google Cloud, etc.), este se encarga de realizar una asignación dinámica de recursos, es decir, los escala automáticamente si crece la demanda y los libera cuando no son utilizados. Solo se cobra por la cantidad de recursos utilizados para ejecutar el código.

    El código generalmente se ejecuta dentro de contenedores *stateless* que pueden ser activados por una variedad de eventos como solicitudes http, eventos de bases de datos, servicios de cola, cargas de archivos, eventos programados, etc. El código que se envía a la nube para ejecución suele tener la forma de una función, por lo tanto severless en ocasiones se refiere a “Functions as a Service” or “FaaS”. Las "FaaS" que ofrecen los principales proovedores de nube son:
    
    * AWS: AWS Lambda
    * Microsoft Azure: Azure Functions
    * Google Cloud: Cloud Functions
    
* **¿Qué es el runtime y que implica seleccionarlo al momento de crear el Function App?**
    
    El runtime es el intervalo de tiempo de ejecución en el cual un programa se ejecuta. En azure esta relacionado con la versión de .NET, Nodejs (desde la versión 3), Python o Java en la que se basa el tiempo de ejecuión. En este caso utilizamos el plan Consumption y la versión de runtime 12, lo cual implica que el tiempo de timeout será de 5 minutos y además nuestra memoria se limpiará en este intervalo de tiempo.

* **¿Por qué es necesario crear un Storage Account de la mano de un Function App?**
    
    Debido a que Azure Functions se basa en Azure Storage para operaciones de almacenamiento y administración como son Manejo de triggers y logs. Azure Storage account nos proporciona un espacio de nombres unico para el almacenamiento.
    
* **¿Cuáles son los tipos de planes para un Function App?, ¿En qué se diferencias?, mencione ventajas y desventajas de cada uno de ellos.**

    **Consumption plan**
    Ofrece  escalabilidad dinámica y factura solo cuando la aplicación es ejecutada, tiene un timeout es de 5 minutos y brinda una memoria máxima de 1.5 GB por instancia, un almacenamiento de 1 GB y un máximo número de instancias de 200. 

    **Premium** 
    Ofrece  escalabilidad dinámica, se factura por el número en segundos de core y la memoria usada en las distintas instancias, puede tener timeouts ilimitados, memoria por instancia de 3.5 GB y un almacenamiento de hasta 250 GB, finalmente ofrece un máximo de 100 instancias.

    **Dedicated**
    El cliente puede implementar manualmente la escalabilidad, puede tener timeouts ilimitados, memoría por instancia de 1.7 GB y una capacidad de almacenamiento hasta de 1000 GB y el numero de instancias es máximo 20. En este plan se paga lo mismo que por otros recursos de App Service, como las aplicaciones web. 

* **¿Por qué la memoization falla o no funciona de forma correcta?**

    Usamos el plan consumption que nos ofrece 1.5 GB por instancia, este tamaño se puede quedar corto a la hora de hacer peticiones con números muy grandes por lo que no logra calcularlos. Pudimos observar que en el momento de realizar una petición muy grande el stack de memoria se llena y el espacio para almacenar la estructura de datos no es suficiente, obtuvimos un error de servidor con la siguiente excepción.
    
    ![](https://media.discordapp.net/attachments/352624122301513730/775546672143007754/unknown.png)

* **¿Cómo funciona el sistema de facturación de las Function App?**

     Azure Functions se factura según el consumo de recursos y las ejecuciones por segundo. Los precios del plan de consumo incluyen 1 millones de solicitudes y 400.000 GB-segundos de consumo de recursos gratuitos al mes. Functions se factura según el consumo de recursos medido en GB-s. El consumo de recursos se calcula multiplicando el tamaño medio de memoria en GB por el tiempo en milisegundos que dura la ejecución de la función. La memoria que una función utiliza se mide redondeando a los 128 MB más cercanos hasta un tamaño de memoria máximo de 1.536 MB, y el tiempo de ejecución se redondea a los 1 ms más cercanos. Para la ejecución de una única función, el tiempo de ejecución mínimo es de 100 ms y la memoria mínima es de 128 MB, respectivamente.
     
* [Informe](#Informe)

## Referencias

https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale
https://azure.microsoft.com/es-es/pricing/details/functions/
https://azure.microsoft.com/en-us/solutions/serverless/
https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview#:~:text=An%20Azure%20storage%20account%20contains,world%20over%20HTTP%20or%20HTTPS.

