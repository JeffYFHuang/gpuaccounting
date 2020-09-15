    //{"id":2,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":4,"limitsMemory":"16Gi","limitsNvidiaComGpu":2,"requestsCpu":4,"requestsMemory":"16Gi","requestsNvidiaComGpu":2}
    // create the data store

	Ext.define('Namespace', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'name'},
		    {name: 'owner'},
		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
		    {name: 'limitsMemory', mapping:'limitsMemory'},
		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
		    {name: 'requestsMemory', mapping:'requestsMemory'},
		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'}
		    //{name: 'pods', mapping:'pods'},
		    //{name: 'namespaceusedresourcequotas', mapping:'namespaceusedresourcequotas'}
		    ],
	    //identifier: 'sequential', // to generate -1, -2 etc on the client
	    proxy: {
	        type: 'ajax',
	        //format: 'json',
	        //appendId: false,
	        //paramsAsJson:true,
	        //idParam: "id",
	        url: '/namespaces',
	        api: {
	            read: '/namespaces',
	            create: '/namespaces',
	            update: '/namespace/setUserQuota',
	            destroy: '/namespaces'
	        },
	        headers: {
	            'Content-Type': "application/json"
	        },
	        reader: {
	            type: 'json',
	      	    totalProperty: 'totalElements',
	    	    successProperty: 'success',
	            root: 'data'
	
	        },
	        writer: {
	            type: 'json',
	            //writeAllFields: true,
	            //encode: true
	        }
	    }
	});

	var namespace_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Namespace'
		  /*proxy: {
		        type: 'ajax',
		        url:'/namespaces',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }*/
		  //remoteSort: true
	});

    Ext.define('App.namespaceGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.namespaceGrid',
        height: this.height,
        stripeRows: true,
        columnLines: true,
        selType: 'rowmodel',
        plugins: {
            ptype: 'rowediting',
            clicksToEdit: 1
        },
        // override
        /**
         * Custom function used for column renderer
         * @param {Object} val
         */
        change: function(val) {
            if (val > 0) {
                return '<span style="color:green;">' + val + '</span>';
            } else if (val < 0) {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        },

        /**
         * Custom function used for column renderer
         * @param {Object} val
         */
        pctChange: function(val) {
            if (val > 0) {
                return '<span style="color:green;">' + val + '%</span>';
            } else if (val < 0) {
                return '<span style="color:red;">' + val + '%</span>';
            }
            return val;
        },

        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{text: "id", sortable: true, width: 70, dataIndex: 'id'},
                {text: "name", sortable: true, flex: 1, dataIndex: 'name'},
                //{id:'owner',header: "owner", sortable: true, dataIndex: 'owner'},
                {text: "requests.cpu", sortable: true, dataIndex: 'requestsCpu', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: 4,
                                value: 4
                            }, {
                                descr: 5,
                                value: 5
                            }, {
                                descr: 6,
                                value: 6
                            }, {
                                descr: 7,
                                value: 7
                            }, {
                                descr: 8,
                                value: 8
                            }, {
                                descr: 9,
                                value: 9
                            }, {
                                descr: 10,
                                value: 10
                            }, {
                                descr: 11,
                                value: 11
                            }, {
                                descr: 12,
                                value: 12
                            }, {
                                descr: 13,
                                value: 13
                            }, {
                                descr: 14,
                                value: 14
                            }, {
                                descr: 15,
                                value: 15
                            }, {
                                descr: 16,
                                value: 16
                            }]
                        })
                    }, renderer: function(value, metaData, record) {
                        switch (value) {
                        default:
                            return value;
                        }
                    }
                },
                {text: "requests.memory", sortable: true, dataIndex: 'requestsMemory', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: true,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: '8Gi',
                                value: '8Gi'
                            }, {
                                descr: '16Gi',
                                value: '16Gi'
                            }, {
                                descr: '32Gi',
                                value: '32Gi'
                            }, {
                                descr: '64Gi',
                                value: '64Gi'
                            }, {
                                descr: '128Gi',
                                value: '128Gi'
                            }, {
                                descr: '256Gi',
                                value: '256Gi'
                            }, {
                                descr: '512Gi',
                                value: '512Gi'
                            }]
                        })
                    },
                    renderer: function(value, metaData, record) {
                        switch (value) {
                        case '8Gi':
                            return "8Gi";
                        case '16Gi':
                            return "16Gi";
                        case '32Gi':
                            return "32Gi";
                        case '64Gi':
                            return "64Gi";
                        case '128Gi':
                            return "128Gi";
                        case '256Gi':
                            return "256Gi";
                        case '512Gi':
                            return "512Gi";
                        default:
                            return value;
                        }
                    }
                },
                {text: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: 1,
                                value: 1
                            }, {
                                descr: 2,
                                value: 2
                            }, {
                                descr: 3,
                                value: 3
                            }, {
                                descr: 4,
                                value: 4
                            }, {
                                descr: 5,
                                value: 5
                            }, {
                                descr: 6,
                                value: 6
                            }, {
                                descr: 7,
                                value: 7
                            }, {
                                descr: 8,
                                value: 8
                            }]
                        })
                    }, renderer: function(value, metaData, record) {
                        switch (value) {
                        default:
                            return value;
                        }
                    }
                },
                {text: "limits.cpu", sortable: true, dataIndex: 'limitsCpu', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: 4,
                                value: 4
                            }, {
                                descr: 5,
                                value: 5
                            }, {
                                descr: 6,
                                value: 6
                            }, {
                                descr: 7,
                                value: 7
                            }, {
                                descr: 8,
                                value: 8
                            }, {
                                descr: 9,
                                value: 9
                            }, {
                                descr: 10,
                                value: 10
                            }, {
                                descr: 11,
                                value: 11
                            }, {
                                descr: 12,
                                value: 12
                            }, {
                                descr: 13,
                                value: 13
                            }, {
                                descr: 14,
                                value: 14
                            }, {
                                descr: 15,
                                value: 15
                            }, {
                                descr: 16,
                                value: 16
                            }]
                        })
                    }, renderer: function(value, metaData, record) {
                        switch (value) {
                        default:
                            return value;
                        }
                    }
                },
                {text: "limits.memory", sortable: true, dataIndex: 'limitsMemory', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: true,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: '8Gi',
                                value: '8Gi'
                            }, {
                                descr: '16Gi',
                                value: '16Gi'
                            }, {
                                descr: '32Gi',
                                value: '32Gi'
                            }, {
                                descr: '64Gi',
                                value: '64Gi'
                            }, {
                                descr: '128Gi',
                                value: '128Gi'
                            }, {
                                descr: '256Gi',
                                value: '256Gi'
                            }, {
                                descr: '512Gi',
                                value: '512Gi'
                            }]
                        })
                    },
                    renderer: function(value, metaData, record) {
                        switch (value) {
                        case '8Gi':
                            return "8Gi";
                        case '16Gi':
                            return "16Gi";
                        case '32Gi':
                            return "32Gi";
                        case '64Gi':
                            return "64Gi";
                        case '128Gi':
                            return "128Gi";
                        case '256Gi':
                            return "256Gi";
                        case '512Gi':
                            return "512Gi";
                        default:
                            return value;
                        }
                    }
                },
                {text: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu', 
                	editor: {
                        xtype: 'combobox',
                        forceSelection: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        valueField: 'value',
                        displayField: 'descr',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['descr', 'value'],
                            data: [{
                                descr: 1,
                                value: 1
                            }, {
                                descr: 2,
                                value: 2
                            }, {
                                descr: 3,
                                value: 3
                            }, {
                                descr: 4,
                                value: 4
                            }, {
                                descr: 5,
                                value: 5
                            }, {
                                descr: 6,
                                value: 6
                            }, {
                                descr: 7,
                                value: 7
                            }, {
                                descr: 8,
                                value: 8
                            }]
                        })
                    }, renderer: function(value, metaData, record) {
                        switch (value) {
                        default:
                            return value;
                        }
                    }
                }
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = namespace_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: namespace_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent(arguments);
            
            this.on('canceledit', function(editor, context, eOpts) {
                // commit the changes right after editing finished
                if (context.record.phantom) {
                    store.remove(context.record);
                }
            });
            
            this.on('edit', function(editor, e) {
    	        e.record.save();
    	        e.record.commit();
            });
        }
    });
