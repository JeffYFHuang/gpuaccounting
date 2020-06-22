Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    // create some portlet tools using built in Ext tool ids
    var tools = [{
        type: 'gear',
        handler: function () {
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    }, {
        type: 'close',
        handler: function (e, target, panel) {
            panel.ownerCt.remove(panel, true);
        }
    }];

 // Simple ComboBox using the data store
	function deepCloneStore (source) {
	    source = Ext.isString(source) ? Ext.data.StoreManager.lookup(source) : source;

	    var target = Ext.create(source.$className, {
	        model: source.model,
	    });

	    target.add(Ext.Array.map(source.getRange(), function (record) {
	        return record.copy();
	    }));

	    return target;
	}


	var user_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Namespace'
	}); 

    Ext.define('App.userComboBox', {
        extend: 'Ext.form.field.ComboBox',
        alias: 'widget.userComboBox',
        fieldLabel: 'Select a user',
        displayField: 'name',
        width: 500,
        labelWidth: 130,
        store: user_ds,
        queryMode: 'local',
        typeAhead: true,
        listeners: {
        	select: function(ele, recs, idx) {
        		//ele.lastSelectEvent = ele.value;
        		var id = recs[0].get('id');
        		namespaceusedquota_ds.proxy.extraParams.namespaceId = id;
        		namespaceusedquota_ds.load();
            },
            scope: this
        }
    });

    Ext.create('Ext.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'grouptabpanel',
            activeGroup: 0,
            items: [{
                mainItem: 0,
                items: [{
                    xtype: 'portalpanel',
                    title: 'Dashboard',
                    tabTip: 'Dashboard tabtip',
                    border: false,
                    items: [{
                        flex: 1,
                        items: [{
                            title: 'Wistron GPU Accounting System',
                            html: '<div class="portlet-content">' + Ext.example.bogusMarkup + '</div>'
                        }]
                    }]
                }, {
                    title: 'Users',
                    iconCls: 'x-icon-users',
                    xtype: 'namespaceGrid',
                    tabTip: 'Users tabtip',
                    style: 'padding: 10px;',
                    tbar:　{
                    	xtype:'toolbar',
                    	
                    }
                    //html: Ext.example.shortBogusMarkup
                }, {
                    title: 'GPUs & Hosts',
                    iconCls: 'x-icon-tickets',
                    tabTip: 'Tickets tabtip',
                    //border: false,
                    xtype: 'gpugrid',
                    margin: '10',
                    height: null
                }, {
                    xtype: 'portalpanel',
                    iconCls: 'x-icon-subscriptions',
                    title: 'Used Quota',
                    border: false,
                    items: [{
                        flex: 1,
                        items: [{
                            title: 'Users',
                            height: '100',
                            items: {
                                xtype: 'userComboBox'
                            }
                        }, {
                            title: 'Used Computing Quota',
                            items: {
                                xtype: 'chartusedquotaportlet'
                            }
                        }, {
                            title: 'Used Quota',
                            height: '200',
                            items: {
                            	itemId: 'namespaceUsedQuotaGrid',
                                xtype: 'namespaceUsedQuotaGrid'
                            }
                        }]
                    }]
                }]
            }/*, {
                expanded: true,
                items: [{
                    title: 'Configuration',
                    iconCls: 'x-icon-configuration',
                    tabTip: 'Configuration tabtip',
                    style: 'padding: 10px;',
                    html: Ext.example.shortBogusMarkup
                }, {
                    title: 'Email Templates',
                    iconCls: 'x-icon-templates',
                    tabTip: 'Templates tabtip',
                    style: 'padding: 10px;',
                    border: false,
                    items: {
                        xtype: 'form',
                        // since we are not using the default 'panel' xtype, we must specify it
                        id: 'form-panel',
                        labelWidth: 75,
                        title: 'Form Layout',
                        bodyStyle: 'padding:15px',
                        labelPad: 20,
                        defaults: {
                            width: 230,
                            labelSeparator: '',
                            msgTarget: 'side'
                        },
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'First Name',
                            name: 'first',
                            allowBlank: false
                        }, {
                            fieldLabel: 'Last Name',
                            name: 'last'
                        }, {
                            fieldLabel: 'Company',
                            name: 'company'
                        }, {
                            fieldLabel: 'Email',
                            name: 'email',
                            vtype: 'email'
                        }],
                        buttons: [{
                            text: 'Save'
                        }, {
                            text: 'Cancel'
                        }]
                    }
                }]
            }, {
                expanded: false,
                items: {
                    title: 'Single item in third',
                    bodyPadding: 10,
                    html: '<h1>The third tab group only has a single entry.<br>This is to test the tab being tagged with both "first" and "last" classes to ensure rounded corners are applied top and bottom</h1>',
                    border: false
                }
            }*/]
        }]
    });
});