example of rule:
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

```
switch created
switch created
switch created

Initializing Home
home switch 1  in state [on ]
home switch 2  in state [on ]
home lamp 1  in state [on ]

shutdown switch 1

[switch1] from :  on
[switch1] from :  off
[switch2] from :  on
[switch2] from :  off
[light1] from :  on
[light1] from :  off

home switch 1  in state [off ]
home switch 2  in state [off ]
home lamp 1  in state [off ]
```
