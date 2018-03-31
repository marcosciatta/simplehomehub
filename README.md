# Devices

I devices sono i componenti basilari del sistema.
Prendendo ad esempio il plugin per le lampade philips, questo instanzierà n device di tipo *bulb* che precisamente ereditano da basedevice ( un contenitore base ) e da switchable device (che ad esempio fa uso di una semplice macchina a stati per gestire il cambio di stato *acceso* *spento*).
L'idea è quella di definire un set di device che sia abbastanza grande da definire i dispositivi di uso comune come:
switch, lampade, sensori di X tipo ecc..
Ogni device ha una propria struttura interna completamente indipendente dagli altri.
*/devices/\*.mjs*

# Gli eventi
Come per l'esempio di sopra, con un device di tipo bulb , è possibile cambiarne lo stato.
Al cambiamento di stato ogni device dovrebbe notificare tramite *messagebus* il cambio di stato con un evento di tipo
**change-state-event** (oggetto *deviceChangedStateEvt*).
Gli eventi sono oggetti definiti in
*system/events.mjs*

# La classe Home
La classe home è la classe che controlla principalmente la coordinazione tra i device e le funzionalità del sistema per quanto riguarda la parte domotica in se. E' una sorta di coordinatore tra causa ed effetto oltre ad avere il compito di eseguire funzioni accessorie come la descrizione dei device configurati ecc.. E' e dovrebbe essere l'unico modo per accedere a i device dopo che sono stati configurati.

Ad esempio ,dopo che un qualsiasi plugin ha instanziato un nuovo device ,questo deve essere registrato nell'oggetto home.
ex
```
let device = new Switch('uuid');
home.addDevice('nameofthedevice',device);
...
let myswitch = home.getDevice('nameofthedevice');
myswitch.off();
```

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


# MIGLIORIE
- [ ] Un sistema decente che permetta di caricare i moduli delle applaiances dinamicamente. (qualcosa che carichi tutti i file della dir x ?)
- [ ] Una soluzione che permetta in modo almeno funzionante e decente di far definire ai moduli applaiances dei servizi che è possibile usare nei trigger *e anche delle azioni che il modulo mette a disposizione su i suoi device*. di questa parte non sono molto sicuro.. è corretto che i plugin mettano a disposizione delle azioni o le azioni sui device devono ben essere definite a priori ?????
- [ ] Rivedere il sistema di regole in toto. (o meglio la parte del match delle regole e la definizione dei trigger, result)
- [ ] Implementare le condizioni delle regole
- [ ] Interfaccia grafica generica
- [ ] Un modo che permetta di salvare e recuperare le regole impostate al boot.
- [ ] Un modo che permetta di aggiungere e o modificare attributi come nome icona dei device (con persistenza)
- [ ] Definizione dei flussi da interfaccia.
- [ ] Sistema di installazione dei plugin una volta registrati , questi infatti non vengon installati di default (per evitare lentezza al boot. Ma vanno pero' attivati da interfaccia. Un metodo install è appropiato ? Vedi il discovery del bridge hue o l'associazione dell'account broadlink.
- [ ] Un modo carino per il discovery dei nuovi device da interfaccia all'aggiunta di un sistema domotico. Pull to refresh?
