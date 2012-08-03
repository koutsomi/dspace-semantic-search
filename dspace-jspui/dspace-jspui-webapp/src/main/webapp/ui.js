/*
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

Array.prototype.exists = function(search) {
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == search) {
			return true;
		}
	}

	return false;
}

function isValueOnArray(value, v) {
	for (var i=0 ; i<v.length ; i++) {
		if (v[i][1] == value) {
			return true;
		}
	}
	return false;	
}

function isValidClass(value) {
	return isValueOnArray(value, dataClasses);
}

function isValidRelation(value) {
	return isValueOnArray(value, dataObjectProperties);
}

function getFullTermDefinition(value) {
	for (var i=0 ; i<dataFull.length ; i++) {
		if (dataFull[i][1] == value) {
			return dataFull[i][0];
		}
	}
	return value;
}

function getAutocompleteStore() {
	return new Ext.data.Store( {
		url : 'result.xml',
		reader : new Ext.data.XmlReader( {
			record : 'rs',
			totalProperty : 'totalCount',
			id : 'id'
		}, [ 'id', 'value' ])
	});
}

function getTermAutocompleteComboBox(label, filterComboBox/*, operationComboBox*/, rightField, filterComboBox) {
	var store = new Ext.data.ArrayStore( {
		fields : [ 'id', 'value', 'group' ],
		data : dataFull
	});
	
	return new Ext.ux.form.GroupingComboBox( {
		store : store,
		groupField: 'group',
		fieldLabel : label,
		displayField : 'value',
		typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		queryParam : 'query',
		selectOnFocus : true,
		width : 250,
		hideTrigger : true,
		listeners: {
			'change': function(field, newValue, oldValue) {		    			
				if (isValidRelation(newValue)) {
					filterComboBox.enable();
//					operationComboBox.enable();
					rightField.enable();
					filterComboBox.setValue('some');
//					operationComboBox.setValue('of type');
				}
			    else {
					filterComboBox.disable();
					filterComboBox.clearValue();
//					operationComboBox.disable();
//					operationComboBox.clearValue();
					rightField.disable();
					rightField.clearValue();
				}
			}
		},
		validator: function(value) {		    	
			if (!value || value=='' || isValidClass(value)) {
				return true;
			}
			else if (isValidRelation(value)) {
				return true;
			}
		    else {
				return 'The term value needs to be a class or a relation';
			}
		}
	});
}

function getRightAutocompleteComboBox(label/*, operationComboBox*/) {
	var store = new Ext.data.ArrayStore( {
		fields : [ 'id', 'value' ],
		data : dataClasses
	});

	return new Ext.form.ComboBox( {
		store : store,
		fieldLabel : label,
		displayField : 'value',
		typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		queryParam : 'query',
		selectOnFocus : true,
		width : 250,
		hideTrigger : true,
		validator: function(value) {
		    /*
            if (operationComboBox.getValue()) {
		    	return true;
		    }
		    */

// GS: changed in order to accept free text in right value field
//			if (!value || value=='' || isValidClass(value)) {
//  		  return true;
//			}
//		  else {
//		    return 'The right value needs to be a class';
//			}
        return true;
		}
	});
}

function getStaticComboBox(label, width, data) {
	var store = new Ext.data.ArrayStore( {
		fields : [ 'id', 'value' ],
		data : data
	});

	return new Ext.form.ComboBox( {
		store : store,
		fieldLabel : label,
		displayField : 'value',
		valueField: 'id',
		typeAhead : false,
		editable: false,
		forceSelection: true,
		autoSelect: true,
		mode : 'local',
		width: width,
		forceSelection : true,
		triggerAction : 'all',
		selectOnFocus : true
	});
}

function getConditionalRadioButtons() {
	return new Ext.form.RadioGroup({
		fieldLabel : 'Condition',
		autoHeight : true,
		width : 100,
		items : [ {
			boxLabel : 'and',
			name : 'condition'
		}, {
			boxLabel : 'or',
			name : 'condition'
		} ]
	});
}

function appInit(expression, reasonerValue, ontologyValue) {
	var store = getAutocompleteStore();
	
	var filterComboBox = getStaticComboBox("Restriction", 100, [ [ 'some', 'some' ], [ 'min', 'min' ], [ 'max', 'max' ], [ 'only', 'only' ],
		[ 'value', 'value' ], [ 'exactly', 'exactly' ]]);
	filterComboBox.disable();

	/*
	var operationComboBox = getStaticComboBox("with value", 100, [ 
		[ 'of type', 'of type'], [ '<', '<' ], [ '<=', '<=' ], [ '>', '>' ], [ '>=', '>=' ],
		[ 'length', 'length' ], [ 'maxLength', 'maxLength' ], [ 'minLength', 'minLength' ],
		[ 'pattern', 'pattern' ], [ 'totalDigits', 'totalDigits' ], [ 'fractionDigits', 'fractionDigits' ]]
	);
	operationComboBox.disable();
	*/
	
	var rightField = getRightAutocompleteComboBox("Expression"/*, operationComboBox*/);
	rightField.disable();
	
	var conditionalRadioButtons = getConditionalRadioButtons();
	
	if (! expression) {
        conditionalRadioButtons.disable();
    }
	else {
		conditionalRadioButtons.enable();
	}
	
	var termField = getTermAutocompleteComboBox("Search for", filterComboBox, /*operationComboBox, */rightField, filterComboBox);
	termField.allowBlank = false;

	var notCheckbox = new Ext.form.Checkbox({
		boxLabel : 'not',
		name : 'condition'
	});
	
	var form = new Ext.FormPanel( {
		labelWidth : 60,
		items : [ {
			xtype: 'compositefield',
			fieldLabel : 'Search for',
			items: [ notCheckbox, termField ]
		}, filterComboBox, {
			xtype: 'compositefield',
			fieldLabel : 'Expression',
			items: [ /*operationComboBox,*/ rightField ]
		}, conditionalRadioButtons ],
		bodyStyle : 'padding:5px',
		buttons : [ {
			xtype : 'button',
			text : 'Add term',
			handler: function (event, button) {
				if (form.getForm().isValid()) {
					var selectedRadio = conditionalRadioButtons.getValue();
					
					if (queryLabel.getValue().length > 0 && !selectedRadio) {
						Ext.MessageBox.alert('Error', 'Either a "Condition" must be selected or press the "Clear query" button to start with a new request');
						return;
					}

					if (isValidRelation(termField.getValue())) {
						if (!filterComboBox.getValue() || !rightField.getValue()) {
							Ext.MessageBox.alert('Error', 'A "Restriction" and an "Expression" must be selected for relations');
							return;
						}
						
						/* 
						if (operationComboBox.getValue() && !filterComboBox.getValue()) {
							Ext.MessageBox.alert('Error', 'A filter condition must be selected when you use an operation');
							return;
						}
						*/
					}

					var value = "";
					
					if (selectedRadio) {
						value += " " + selectedRadio.boxLabel + " ";
					}

					if (notCheckbox.getValue()) {
						value += "not ";
					}
					
					value += getFullTermDefinition(termField.getValue()) + " ";
						
					if (isValidRelation(termField.getValue())) {
						value += filterComboBox.getValue() + " ";
						
						/*  
						if (operationComboBox.getValue() && operationComboBox.getValue() != 'of type') {
							value += operationComboBox.getValue() + " ";
						}
						*/
						
						value += getFullTermDefinition(rightField.getValue());
					}

					queryLabel.setValue(queryLabel.getValue() + value);
					conditionalRadioButtons.enable();
					form.getForm().reset();
				}
				else {
					 Ext.MessageBox.alert('Error', 'Can not add term until the information are valid');	
				}
			}
		} ]
	});

	var reasonerCombobox = getStaticComboBox("Reasoner", 200, [[ 'FACTPLUSPLUS', 'Fact++'], [ 'PELLET', 'Pellet' ], [ 'HERMIT', 'HermiT' ]]);
	reasonerCombobox.setValue(reasonerValue);
	
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.state.Manager.getProvider(); 
    
    var urlStore = new Ext.data.SimpleStore({ 
        fields: ['url'] 
        , data: Ext.state.Manager.get('URLStore', []) 
    });
    var path = window.location.pathname;
    var defaultOnt = "http://"+window.location.host+path.substring(0, path.lastIndexOf('/'))+'/dspace-ont';
    var aRecord = new urlStore.recordType({url:defaultOnt});
    urlStore.insert(0, aRecord);
    function saveURL(url) { 
        if (Ext.isEmpty(url)) 
            return;
        
        urlStore.clearFilter(false);

        if (urlStore.find('url', url) < 0) { 
            var data = [[url],'']; 
            var count = urlStore.getTotalCount(); 
            var limit = count > 10? 9: count; 
             
            for (var i = 1; i <= limit; i++) 
                data.push([urlStore.getAt(i).get('url')]);
            
            if (Ext.state.Manager.getProvider()) 
                Ext.state.Manager.set('URLStore', data); 
             
            urlStore.loadData(data); 
        } 
    }	
	var ontologyCombobox = new Ext.form.ComboBox({
		   fieldLabel:'Ontology',
		   displayField: 'url',
		   valueField: 'url',
		   width: 400,
		   vtype: 'url',
		   vtypeText: 'Please enter a valid URL for your ontology',
		   store: urlStore,
		   triggerAction:'all',
		   typeAhead:true,
		   mode:'local',
		   minChars:1,
		   //forceSelection:true,
		   hideTrigger:true,
		   value: ontologyValue,
		});
	ontologyCombobox.setValue(ontologyValue);
	
	var optionsForm = new Ext.FormPanel( {
		labelWidth : 60,
		monitorValid : true,
		items : [ reasonerCombobox, ontologyCombobox],
		bodyStyle : 'padding:5px',
		buttons : [ {
			xtype : 'button',
			text : 'Save options',
			formBind: true,
			handler: function (event, button) {
				
				saveURL(ontologyCombobox.getValue());
			    window.location = 'semantic-search?URL=' + encodeURI(ontologyCombobox.getValue()).replace('+', '%2B') + '&reasoner=' + reasonerCombobox.getValue();
			}
		},{
			xtype : 'button',
			text : 'Reload',
			formBind: true,
			handler: function (event, button) {
				window.location = 'semantic-search?URL=' + encodeURI(ontologyCombobox.getValue()).replace('+', '%2B') + '&reasoner=' + reasonerCombobox.getValue() + '&reload=true';				
			}
		} ]
	});

	var queryLabel = new Ext.form.TextField({
		fieldLabel : 'Generated query',
		anchor : "-10px",
		value: expression
	});

        var reasonerLabel = new Ext.form.Label({
                text : "Loaded reasoner is " + reasonerValue
        });
	
	var queryExplain = new Ext.form.FieldSet( {
		labelWidth : 100,
		bodyStyle : 'font:12px tahoma,arial,helvetica,sans-serif; text-align:right;',
		items: [ queryLabel, reasonerLabel ]
	});

	var searchPanel = new Ext.Panel( {
		title : 'Search',
		bodyStyle : 'padding:5px',
		buttonAlign : 'center',
		autoHeight : true,
		items : [ form, queryExplain ],
		buttons : [ {
			xtype : 'button',
			text : 'Search',
			handler: function(event) {
			    if (queryLabel.getValue().length>0) {
					window.location = 'semantic-search?semantic=true&syntax=man&expression=' + encodeURI(queryLabel.getValue()); 
				}
			}
		}, {
			xtype : 'button',
			text : 'Clear query',
			handler: function(event) {
			   form.getForm().reset();
			   queryLabel.setValue("");
	           conditionalRadioButtons.disable();
               conditionalRadioButtons.reset();
			}
		} ]
	});

	var advancedPanel = new Ext.Panel( {
		title : 'Advanced topics'
	});

	var optionsPanel = new Ext.Panel( {
		title : 'Options',
		bodyStyle : 'padding:5px',
		buttonAlign : 'center',
		autoHeight : true,
		items : [ optionsForm ]
	});

	var tabs = new Ext.TabPanel( {
		renderTo : 'destino',
		activeTab : 0,
		deferredRender: false,
		forceLayout: true,
		items : [ searchPanel, advancedPanel, optionsPanel ]
	});
	
	termField.focus();
}
