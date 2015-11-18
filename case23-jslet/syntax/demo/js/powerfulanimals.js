var dsAnimalType = jslet.data.createEnumDataset('animaltype','1-Felidas;2-Canine;3-Bear');

var dsFelidas = jslet.data.createEnumDataset('felidas','1-Lion;2-Tiger;3-Cat');

var dsCanine = jslet.data.createEnumDataset('canine','1-Wolf;2-Fox;3-Dog');

var dsBear = jslet.data.createEnumDataset('bear','1-Polar Bear;2-Grizzly Bear;3-Panda');

var dsAnimals = new jslet.data.Dataset('animals');

var f = jslet.data.createStringField('animaltype', 10);
f.label('Animal Type');
var lkf = new jslet.data.FieldLookup();
lkf.dataset(dsAnimalType);
f.lookup(lkf);
dsAnimals.addField(f);

f = jslet.data.createStringField('powerfulanimal', 20);
f.label('Most Powerful Animal');
lkf = new jslet.data.FieldLookup();
f.lookup(lkf);
dsAnimals.addField(f);

lkFelidas = new jslet.data.FieldLookup();
lkFelidas.dataset(dsFelidas);

lkCanine = new jslet.data.FieldLookup();
lkCanine.dataset(dsCanine);

lkBear = new jslet.data.FieldLookup();
lkBear.dataset(dsBear);

//var cr = new jslet.data.ContextRule(dsAnimals);
//cr.addRuleItem('powerfulanimal','[animaltype]=='1'', null,null);
//cr.addRuleItem('powerfulanimal','[animaltype]=='2'', null,null)
//cr.addRuleItem('powerfulanimal','[animaltype]=='3'', null,null)
//dsAnimals.contextRule(cr);
//dsAnimals.enableContextRule();


var dataList = [{
			animaltype : '1',
			powerfulanimal : '1'
		}, {
			animaltype : '2',
			powerfulanimal : '2'
		}, {
			animaltype : '3',
			powerfulanimal : '1'
		}];
dsAnimals.dataList(dataList);
