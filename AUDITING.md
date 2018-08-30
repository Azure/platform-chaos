# Auditing

This document defines how Platform Chaos audits chaos events. It lists what is tracked and how it is formatted.

## Tracked Data

When a chaos event is terminated through an *API*, *CLI*, or *Extension*, the following properties are recorded and exported through a JSON object.
  - An `id` unique to this event instantiation (`guid`). 
  - A `chaos-type` of enumerable type `initiate`
  - `user` and `system` that terminated the event
  - `date` of event initiation (including time `UTC`)
  - targeted `resources`. This is broken down by `subscriptionID` and then by `resourceGroup`
  - Chaos `event` information (`eventID`, `eventName`, `eventURL`)

Additionally an *Extension* may record additional information regarding the specificities of the event. This information is stored within an `extension` property.

Every chaos event initiation/termination will be logged. The general structure of an event log is defined below:

- _event log_ (Object)
  - `id` (String) 
    - GUID unique to this event instantiation
  - `type` (String) 
    - One of `'initiate'`, `'terminate'`
  - `user` (String)
    - Some identifiable piece of information specifying which user executed the chaos event
  - `system` (String | Object)
    - Some identifiable piece of information specifying which system the chaos event was executed from
    - If more system information can be provided, do so in the form of an object
  - `date` (String)
    - UTC timestamp of chaos event initiation
  - `resources` (Object)
    - An object that specifies the resources the chaos event has been executed on
    - `subscriptionID` (String)
    - `_resources` (Object):
      - _key_ attributes are Azure resource group names
      - Each resource group property is of type (Array) and contains the list of resources names
      - Example: 
        ```json
          "_resources": { 
            "resourceGroup1": [ "resName1" , "resName2" ], 
            ...
          },
  - `event` (Object)
    - `eventID` (String)
    - `eventName` (String)
    - `eventURL` (String)
  - `extenstion` (Object)
    - an optional object extension authors can utilize to log pertinant data relate to their module.

Here is an example template:

```json
{
  "id": "",
  "chaos_type": "initiate",
  "user": "",
  "system": "",
  "date": "",
  "resources": {
    "subscriptionID": "",
    "_resources": {
      "resourceGroupID1": [ "res_name_1", "res_name_2"],
      "resourceGroupID2": [ "res_name_3", ... ],
      ...
    }
  },
  "event": {
    "eventID": "",
    "eventName": "",
    "eventURL": ""
  },
  "extension": { ... }
}
```

