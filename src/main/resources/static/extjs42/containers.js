	Ext.define('Container', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'podId', type: 'int', mapping:'podId'},
		    {name: 'name', mapping:'name'},
		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
		    {name: 'limitsMemory', mapping:'limitsMemory'},
		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
		    {name: 'requestsMemory', mapping:'requestsMemory'},
		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
		    {name: 'nspid', type: 'int', mapping:'nspid'}
		    ]
	});

	var container_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Container',
		  proxy: {
		        type: 'ajax',
		        url:'/containers',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	});

    Ext.define('App.containerGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.containergrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'c.id',text: "id", sortable: true, width: 30, dataIndex: 'id'},
            	//{id:'c.pod.id',text: "pod.id", sortable: true, dataIndex: 'podId'},
                {id:'c.name',text: "name", sortable: true, dataIndex: 'name'},
                {id:'c.nspid',text: "nspid", sortable: true, dataIndex: 'nspid'},
                {id:'c.limitsCpu',text: "limits.cpu", sortable: true, dataIndex: 'limitsCpu'},
                {id:'c.limitsMemory',text: "limits.memory", sortable: true, dataIndex: 'limitsMemory'},
                {id:'c.limitsNvidiaComGpu',text: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu'},
                {id:'c.requestsCpu',text: "requests.cpu", sortable: true, dataIndex: 'requestsCpu'},
                {id:'c.requestsMemory',text: "requests.memory", sortable: true, dataIndex: 'requestsMemory'},
                {id:'c.requestsNvidiaComGpu',text: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = container_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: container_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });
//});