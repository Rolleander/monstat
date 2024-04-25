# MONeySTATs

### Quickstart

1. Checkout project
2. Make sure to install Deno: https://deno.land/manual/getting_started/installation
3. Then start the project:

```
deno task start
```

### Data import 

Create a folder named **csv** in the project and drop all csv exports from your bank accounts

### Configuration

Create a file **config.json** and specify the csv formats and your categories there

Example configuration

```json
{
	"initialBalance": 20644.51,
	"formats": [
		{
			"fileBegin" : "MY_BANK",
			"dateFormat" : "dd.MM.yyyy",
			"columnIndexes": {
				"amount" : 7,
				"date" : 0,
				"iban" : 5,
				"target" : 3,
				"description": 4
			}
		},
	],
	"categories": [
		{
			"name" : "Loan",
			"color" : "#71CE5B",
			"rule": {
				"descriptionContains" : ["Loan","Compensation"],
				"targetContains" : ["MyEmployer"]
			}
		},
		{
			"name" : "Groceries",
			"color" : "#307CB7",
			"rule": {
				"targetContains" : ["Extra Super Super Market"]
			}
		},
		{
			"name" : "MyBroker",
			"color" : "#669999",
			"type" : "INVEST",
			"rule": {
				"ibanContains" : ["DEXXXX"]
			}
		},
	]
}
```

