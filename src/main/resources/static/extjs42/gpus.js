    //{"id":1,"uuid":"GPU-1dc1efe9-ae19-26bc-7ce5-b57a27a821aa","name":"Tesla V100-SXM3-32GB","enforcedpowerlimit":350,"memorytotal":32480,"hostname":"dgx-18-04-op1"}
    // create the data store
	Ext.define('Gpu', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'hostname', mapping:'hostname'},
		    {name: 'enforced.power.limit', type: 'int', mapping:'enforcedpowerlimit'},
		    {name: 'memory.total', type: 'int', mapping:'memorytotal'},
		    {name: 'uuid', mapping:'uuid'},
		    {name: 'name', mapping:'name'}
		    ]
	});

	var gpu_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Gpu',
		  proxy: {
		        type: 'ajax',
		        url:'/gpus',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	});

    Ext.define('App.gpuGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.gpugrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'gpu.id',text: "id", sortable: true, width: 30, dataIndex: 'id'},
                {id:'gpu.hostname',text: "hostname", sortable: true, width: 100, dataIndex: 'hostname'},
                {id:'gpu.memory.total',text: "memory.total", sortable: true, width: 100, dataIndex: 'memory.total'},
                {id:'gpu.enforced.power.limit',text: "enforced.power.limit", sortable: true, width: 100, dataIndex: 'enforced.power.limit'},
                {id:'gpu.uuid',text: "uuid", sortable: true, width: 150, dataIndex: 'uuid'},
                {id:'gpu.name',text: "name", sortable: true, width: 150, dataIndex: 'name'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = gpu_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: gpu_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });
//});