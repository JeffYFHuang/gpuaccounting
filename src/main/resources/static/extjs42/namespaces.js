    //{"id":2,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":4,"limitsMemory":"16Gi","limitsNvidiaComGpu":2,"requestsCpu":4,"requestsMemory":"16Gi","requestsNvidiaComGpu":2}
    // create the data store

	Ext.define('Namespace', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'namespaceId', type: 'int', mapping:'id'},
		    {name: 'name'},
		    {name: 'owner'},
		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
		    {name: 'limitsMemory', mapping:'limitsMemory'},
		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
		    {name: 'requestsMemory', mapping:'requestsMemory'},
		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
		    {name: 'pods', mapping:'pods'},
		    {name: 'namespaceusedresourcequotas', mapping:'namespaceusedresourcequotas'}
		    ]
	});

	var namespace_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Namespace',
		  proxy: {
		        type: 'ajax',
		        url:'/namespaces',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 

    Ext.define('App.namespaceGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.namespacegrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'namespace.id',text: "id", sortable: true, width: 70, dataIndex: 'id'},
                {id:'namespace.Name',text: "name", sortable: true, dataIndex: 'name'},
                //{id:'owner',header: "owner", sortable: true, dataIndex: 'owner'},
                {id:'namespace.limitsCpu',text: "limits.cpu", sortable: true, dataIndex: 'limitsCpu'},
                {id:'namespace.limitsMemory',text: "limits.memory", sortable: true, dataIndex: 'limitsMemory'},
                {id:'namespace.limitsNvidiaComGpu',text: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu'},
                {id:'namespace.requestsCpu',text: "requests.cpu", sortable: true, dataIndex: 'requestsCpu'},
                {id:'namespace.requestsMemory',text: "requests.memory", sortable: true, dataIndex: 'requestsMemory'},
                {id:'namespace.requestsNvidiaComGpu',text: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu'}
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

            this.callParent();
        }
    });
