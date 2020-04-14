	Ext.define('Pod', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'name', mapping:'name'},
		    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
		    {name: 'hostname', mapping:'hostname'},
		    {name: 'phase', mapping:'phase'},
		    {name: 'startTime', mapping:'startTime'},
		    {name: 'queryTime', mapping:'queryTime'},
		    {name: 'gpus', mapping:'gpus'}
		    ]
	});

	var pod_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Pod',
		  proxy: {
		        type: 'ajax',
		        url:'/pods',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 

    Ext.define('App.podGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.podgrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'pod.id',text: "id", sortable: true, width: 30, dataIndex: 'id'},
            	{id:'pod.namespace.id',text: "namespace.id", sortable: true, dataIndex: 'namespaceId'},
                {id:'pod.name',text: "name", sortable: true, dataIndex: 'name'},
                //{id:'phase',text: "phase", sortable: true, dataIndex: 'phase'},
                {id:'pod.startTime',text: "startTime", sortable: true, dataIndex: 'startTime'},
                {id:'pod.queryTime',text: "queryTime", sortable: true, dataIndex: 'queryTime'},
                {id:'pod.hostname',text: "hostname", sortable: true, dataIndex: 'hostname'}
                ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = pod_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: pod_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });
//});