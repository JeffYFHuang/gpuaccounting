//    {"id":1,"pid":32399,"nspid":4026551453,"containerId":5,"command":"python3","fullCommand":"['/usr/bin/python3', '-m', 'ipykernel_launcher', '-f', '/home/jovyan/.local/share/jupyter/runtime/kernel-05d873a3-f9e8-4b97-aafd-d1bf80520988.json']","startTime":"2020-03-16 17:56:55"}

Ext.define('Process', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'pid', type: 'int', mapping:'pid'},
		    {name: 'nspid', type: 'int', mapping:'nspid'},
		    {name: 'containerId', type: 'int', mapping:'containerId'},
		    {name: 'command', mapping:'command'},
		    {name: 'fullCommand', mapping:'fullCommand'},
		    {name: 'startTime', mapping:'startTime'},
		    {name: 'queryTime', mapping:'queryTime'},
		    {name: 'gpus', mapping:'container.gpus'}
		    ]
	});

	var process_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Process',
		  proxy: {
		        type: 'ajax',
		        url:'/processes',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	});

    Ext.define('App.processGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.processgrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'process.id',text: "id", sortable: true, width: 30, dataIndex: 'id'},
            	//{id:'process.container.id',text: "container.id", sortable: true, dataIndex: 'containerId'},
                {id:'process.pid',text: "pid", sortable: true, dataIndex: 'pid'},
                {id:'process.startTime',text: "startTime", sortable: true, dataIndex: 'startTime'},
                {id:'process.queryTime',text: "queryTime", sortable: true, dataIndex: 'queryTime'},
                {id:'process.fullCommand',text: "fullCommand", sortable: true, dataIndex: 'fullCommand'},
                {id:'process.nspid',text: "nspid", sortable: true, dataIndex: 'nspid'}
                ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = process_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: process_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });
//});