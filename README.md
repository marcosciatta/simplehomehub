# Update 1.0.3

# Requisiti

-  **Node 9.0**
-  **Mongodb installato e configurato correttamente**
*viene usato per mantere informazioni accessorie, come ad esempio i plugin installati, configurazioni ecc..*
-  Redis installato e configurato correttamente 
*viene utilizzato come servizio iniettabile per i componenti. Ad esempio l'hue stora li l'id del bridge e l'utente registrato*

# Api
## Components 
Lista dei componenti disponibili
```
GET /api/components
```

```
[
    {
        "id": "hue",
        "type": "applaiance",
        "name": "Philips hue",
        "icon": "/applaiances/hue.jpg",
        "short_name": "Philips Hue"
    }
]
```

Installazione di un componente
```
GET /api/components/{component_id}/install
```

```
"Installation launched. See debug console for required operations"
```

**Nota: Alcuni componenti richiedono l'intervento dell'utente per proseguire con l'installazione. come ad esempio le hue. Dato che manca interfaccia grafica, fare attenzione ai messaggi della console**
**Nota: Una volta che il componente è installato il record è scritto in mongo **


Lista e dettaglio dei devices disponibili
```
GET /api/home/devices  e GET /api/home/device/{identity}
```

```
[
    {
        "identity": "xx:xx:xx:xx:xx:xx",
        "realm": "hue",
        "type": "rgblight",
        "name": "Cucina",
        "state": "off",
        "attributes": {
            "id": "1",
            "type": "Extended color light",
            "name": "Cucina",
            "reachable": true,
            "brightness": 254,
            "colorMode": "ct",
            "hue": 14988,
            "saturation": 141,
            "colorTemp": 366,
            "alert": "none",
            "effect": "none"
        },
        "data": {
            "manufacturer": "Philips",
            "modelId": "LCT007",
            "model": {
                "details": {
                    "id": "LCT007",
                    "manufacturer": "Philips",
                    "name": "Hue bulb A19",
                    "type": "Extended Color Light",
                    "colorGamut": "B",
                    "friendsOfHue": true
                }
            },
            "software_version": "5.105.0.21536"
        },
        ...     
]
```

Cambiare lo stato di un device
```
PATCH api/home/device/{device_identity}/change_state
```
```
{
	"state": "on"
}
```
```
"Command sended"
```



Example Flow
```sh
info: [system] Start system...
info: [system] Initializing plugins...
debug: [system] Load plugin [hue]
debug: [pluginRegistry] Register plugin [hue]
info: [system] Install Hue component
debug: [Hue] Start component
debug: [Hue] Register listeners
debug: [Hue] Install component...
debug: [Hue] Creating one light device on realm [hue]
debug: [Home] Added device [light001]
debug: [messagebus] Publish message
debug: [messagebus]  channel=home, topic=hue.device_added, identity=light001, state=off, , realm=hue,
info: [system] Turn on hue light explicit
debug: [Home] get device light001
debug: [system] Light state is off
debug: [system] Light state is on
info: [system] Turn off hue light with event
debug: [system] Light state is on
debug: [messagebus] Publish message
debug: [messagebus]  channel=home, topic=home.change.state, operation=off, identity=light001
debug: [Home] Change state to device [light001] to off
debug: [Home] get device light001
debug: [messagebus] Publish message
debug: [messagebus]  channel=home, topic=hue.changed.state, from=on, to=off
debug: [Hue] Recived message
info: [Hue] Shutdown lamp
debug: [system] Light state is off
[nodemon] clean exit - waiting for changes before restart

```

## I device e la classe Home

### I device
I device sono il fulcro dell'ambaradam :D
I devices sono i componenti basilari del sistema.
Prendendo ad esempio il plugin per le lampade philips, questo instanzierà n device di tipo *bulb* che precisamente ereditano da basedevice ( un contenitore base ) e da switchable device (che ad esempio fa uso di una semplice macchina a stati per gestire il cambio di stato *acceso* *spento*).
L'idea è quella di definire un set di device che sia abbastanza grande da definire i dispositivi di uso comune come:
switch, lampade, sensori di X tipo ecc..
Ogni device ha una propria struttura interna completamente indipendente dagli altri.
*/devices/\*.mjs*

Il device si occupa di gestire un singolo apparato presente nella casa. 
Un device al momento è composto da: 
- Identity
- Realm
- Stati
- Attributi
- Dati Accessori
- Operazioni

#### Identity
Identifica univocamente il device.

#### Ream
Identifica il reame di appartenenza del device. Una lampada ad esempio puo' essere Hue, Lightfx , Ikea , Pappappero...

#### Stati
Alcuni device possono avere degli stati come ad esempio le lampade (on , off) , mentre alcuni no (sensori) .
I device che hanno degli stati dovrebbero definirli tramite l'oggetto StateMachine all'interno del device stesso nell'attributo this.machine;

Esempio:
```javascript
  constructor(){
    this.machine = new StateMachine({
      init: this.defaultState,
      transitions: [
        { name: 'on', from: 'off', to: 'on' },
        { name: 'off', from: 'on', to: 'off'},
        { name: 'goto', from: '*', to: function(s) { return s } }
      ]     
    });
    }
```

#### Attributi
Quasi tutti i device, oltre agli stati veri e propri hanno una serie di attributti modificabili (ad esempio colore, luminosità velocità ecc..). 


#### Dati Accessori
Informazioni addizionali registrate nel device (applaiance model hardware address ecc..) utili per la gestione dello stesso

#### Operazioni
Una lista delle operazioni che è possibile compiere sul device. Se ad esempio il device implementa una statemachine queste potrebberro essere le transizioni possibili.

I device dovrebbero ereditare tutti dalla classe base BaseDevice o una sua derivata. 
2 Esempi di device sono Switch e Light
- Switch
- Light

### La classe home 
La classe home è la classe che controlla principalmente la coordinazione tra i device e le funzionalità del sistema per quanto riguarda la parte domotica in se. E' una sorta di coordinatore tra causa ed effetto oltre ad avere il compito di eseguire funzioni accessorie come la descrizione dei device configurati ecc.. E' e dovrebbe essere l'unico modo per accedere a i device dopo che sono stati configurati.

```javascript
home.addDevice('light_1', new Light(...)));
```
Questa si prende in carico tutto le operazioni di gestione dei vari device e delle azioni possibili sia sui device sia tramite azioni registrate dai componenti. 
Ad Esempio:
```javascript
home.changeDeviceState('ligth_1','off');
```

## Gli eventi
Il sistema di eventi è la parte piu importante del sistema e funge da collante tra la rappresentazione dei devices e i componenti che si occupano effettivamente della loro gestione.
Varie tipologie di azioni vengono scatenate ogni volta che un particolare evento accade nel sistema. 

**NOTA: Al momento della registrazione di un device , il componente puo' settare una proprietà in piu al device che è *com_type* che puo' essere SYNC o ASYNC. Se sync l'evento sarà lanciato sul bus e non sarà attesa risposta, mentre async il sistema lancerà l'evento ma si aspetterà una promise in ritorno e aggiornerà lo stato del device effettviamente dopo che la promise sarà risolta**

Ad Esempio:

Al cambiamento di stato di un device di tipo *light* con realm *Hue*

L'home lancia un evento
***'DeviceStateChangeEvent'***  sul message bus. 
**(NOTA: E' possibile utilizzare delle classi per comodità nella generazione degli eventi ma non necessario)**
**(NOTA: Vanno quindi definiti a priori in qualche doc ve??)**

Questo evento è composto tra gli altri dati dall'identity del device e il realm di appartenenza. 

Sarà compito del componente stesso (in questo esempio Hue) dover ascoltare un evento 

**hue.changed_state**

ed eseguire un operazione come ad esempio chiamare una api sul bridge hue.
*NOTA: Gli eventi , tutti, sono prefissati con il realm di appartenenza dell'oggetto che lo ha scatenato*


Questo è vero per il contrario anche con una piccola differenza. 
Nel caso inverso .. sarà Home ad ascoltare gli eventi provenienti dai componenti.

Ad esempio:

Se il componente hue (in polling) si accorgesse che lo stato di una lampada è cambiato dovrebbe mandare un messaggio sul bus
**DeviceChangeStateEvent***

Il componente home , già in ascolto su eventi predefiniti, recupererà il messaggio e il device appropiato ed eseguirà il cambiamento di stato. 

**NOTA:MA se fosse il device stesso a lanciare l'evento del cambio di stato ? Ma poi come si fa ad evitare che su richiesta di cambio di stato si rilanci l'evento di cambio di stato del device entrando in loop??**

Gli eventi sono oggetti definiti in
 *system/events.mjs*


## Servizi disponibili per di
I servizi che è possibile iniettare sono:

- **ee** => Event Emitter
- **logger** => Winston logger
- **messagebus** => Il message bus
- **componentRegistry** => il registro dei compoenti
- **home** => la classe principale di controllo hub domestico


## Gestione componenti
I componenti nella cartella */components* vengono caricati automaticamente al boot tramite il **ComponentRegistry**.

Le classi componenti devono estendere la classe *BaseComponent* che implementa alcni metodi di base e utilità.

Inoltre le classi dei componenti possono far uso dei servizi già registrati nel di container tramite la definizione di parameteri nel costruttore 

Esempio
```javascript
 class Hue {
  constructor(eventEmitter, home, messageBus){
    this.ee = eventEmiiter;
    ...
  }
 }
```
Per funzionare correttamente e permetterne la registrazione i componenti devono implementare almeno il metodo **registerInfo()** che torni un oggetto con le chiavi uguali a quello dell'esempio. Valori che poi vengono utilizzati durante la registrazione del componente. (Nota: Renderlo un oggetto piu esplicito). 
```javascript
  class Hue extends BaseComponent{
  ....
    static registerInfo(){
      return {
        id: 'hue', 
        type: PluginRegistry.typeApplaiance, 
        name: 'Philips hue', 
        'icon': '/applaiances/hue.jpg',
        'short_name': 'Philips Hue'
       };
    }
 ...
```
Durante la registrazione del componente inoltre viene chiamato anche il metodo  **registerService** automaticamente. In questo metodo è necessario specificare i servizi che il modulo esporta nella forma di hash con arrow function (in modo da mantenere il contesto)... *NOTA: se troviamo un modo migliore è meglio*.

Esempio:
```javascript
  registerServices(){
    return {
      set_scene: (param) => {this.setSceneExample(param) },
      delete_scene: (param) => { this.deleteScene(param) }
    }
  }

```
I componenti al boot vengono solo registrati e non installati. L'installazione avviene su richiesta.

Al moemnto dell'installazione, viene richiamato automaticamente il metodo *install()* che si dovrebbe occupare di creare i devices e registrarli nella classe Home e di avviare funzioni accessorie dipendenti del componente.

Esempio:
```javascript
...
install(){
  for( let device_data of bridge.discovery()){
    this.home.registerDevice(new Device(device_data));
  }
  this.registerListeners();
}
...
```





#  DA CAPIRE PER FINIRE LA BASE
- [X]  Un sistema decente che permetta di caricare i moduli delle applaiances dinamicamente. (qualcosa che carichi tutti i file della dir x ?)
- [X] Una soluzione che permetta in modo almeno funzionante e decente, di far definire ai moduli applaiances dei *servizi* (*o eventi??*) che è possibile usare, che corrispondono a delle azioni che il modulo mette a disposizione. Di questa parte non sono molto sicuro.. è corretto che i plugin mettano a disposizione delle azioni o le azioni sui device devono ben essere definite a priori (tipo documentate) ????? oppure deve essere tutto ad eventi ??   **E come fa un servizio qualsiasi a sapere che quella "hue.activate_scene" corrisponse all'azione setScene(scene_id) del servizio registrato come 'hue'?**






# Sistema di regole (da rivedere in toto)
E' un semplice sistema piuttosto basilare al momento.
## Regole
Una regola è un semplice oggetto js ad esempio
```
let rule_expr = {
  trigger: {
    type: 'event',
    name: 'change-state-event',
    with: {
      device_identity: 'switch1',
      state: 'off'
    }
  },
  result:[ {
    type: 'event',
    name: 'change-state-to-event',
    with: {
      device_identity: 'switch2',
      state: 'off'
    }
  },
  {
    type: 'service',
    name: 'waith_some_time',
    with: {
      seconds: 30
    }
  },
  {
    type: 'event',
    name: 'change-state-to-event',
    with: {
      device_identity: 'light1',
      state: 'off'
    }
  }
  ]
};
```
Questo puo' contenere 2 campi principali al momento:
**trigger** e **result**
Definiti dai campi
*type*: Identitica il tipo di trigger/response (per il trigger è possibile solo 'event' (ovvero solo gli eventi scatenano trigger), mentre per i result potrebbero essere *event* o *service*
*name*: l'identificativo dell'evento/servizio
*with*: I parametri che in caso di trigger devono matchare o nel caso di result verranno passati all'oggetto dichiarato dalla coppia name/type.

### Trigger
Trigger indentifica l'evento che scatenerà la regola. i parametri sono diversi per ogni tipo di evento che puo' scatenare un trigger. Questi vanno ducumentati.
Qui sopra ad esempio si triggera la regola grazie all'evento **deviceChangedStateEvt**.
I trigger sono solo e soltanto di tipo *event*

### Result
Sono le azioni che la regola scatenerà. Possono essere piu di una , e vengono eseguite in ordine di definizione. Il tutto è in promise async.

## RuleEngine
E' il componente che si occupa di gestire le regole. Una volta creata una regola infatti , questa va registrata nel ruleengine con un nome  ad esempio :
```
 let ruleEngine = container.resolve('ruleengine');
 let rule = new Rule({});
 ruleEngine.addRule('shutdown-the-light-delayed',rule);
```

L'engine di regole al boot, si registra su tutti i canali interessati, (quindi '#') e ascolta gli eventi.
Tenendo conto che l'engine si salva una mappa delle regole nel formato (trigger => regola), quando arriva ad esempio un evento
va a recuperare le regole corrispondenti e lancia il process della regola.
**E' quindi necessario implementare successivamente un sistema di cache dei trigger => regole onde evitare eccessiva lentezza**
Quando l'engine trova le regole che sono candidate all'escuizone, esegue il metodo process dell'oggetto regola per controllare se questa matcha o meno con i dati in input del trigger definito nella regola stessa.
Nel caso il match sia positivo , la classe **Rule** è in grado di gestire tutti i tipi di trigger disponibili.

