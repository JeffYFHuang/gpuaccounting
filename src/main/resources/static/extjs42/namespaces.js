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
	                    xtype: 'textfield',
	                    allowBlank: false
                	}
                },
                {text: "requests.memory", sortable: true, dataIndex: 'requestsMemory', 
                	editor: {
	                    xtype: 'textfield',
	                    allowBlank: false
                	}
                },
                {text: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu', 
                	editor: {
	                    xtype: 'textfield',
	                    allowBlank: false
                	}
                },
                {text: "limits.cpu", sortable: true, dataIndex: 'limitsCpu', 
                	editor: {
	                    xtype: 'textfield',
	                    allowBlank: false
                	}
                },
                {text: "limits.memory", sortable: true, dataIndex: 'limitsMemory', 
                	editor: {
	                    xtype: 'textfield',
	                    allowBlank: false
                	}
                },
                {text: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu', 
                	editor: {
	                    xtype: 'textfield',
	                    allowBlank: false
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
