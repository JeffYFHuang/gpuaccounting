// {"id":1,"processId":1,"gpumetricId":15,"gpuMemoryUsage":31089,"cpuPercent":0.0,"cpuMemoryUsage":2979635200,"queryTime":"2020-03-17T08:20:00.855911","gpumetric":{"id":15,"gpuId":15,"temperatureGpu":37,"utilizationGpu":0,"powerDraw":70,"memoryUsed":31100,"queryTime":"2020-03-17T08:20:00.855911"}}
	Ext.define('Metric', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'processId', type: 'int', mapping:'processId'},
		    {name: 'gpumetricId', type: 'int', mapping:'gpumetricId'},
		    {name: 'cpu.percent', type: 'float', mapping:'cpuPercent'},
		    {name: 'cpu.memory.usage', type: 'int', mapping:'cpuMemoryUsage'},
		    {name: 'gpu.id', type: 'int', mapping:'gpumetric.gpuId'},
		    {name: 'utilization.gpu', type: 'int', mapping:'gpumetric.utilizationGpu'},
		    {name: 'gpu.memory.usage', type: 'int', mapping:'gpumetric.memoryUsed'},
		    {name: 'temperature.gpu', type: 'int', mapping:'gpumetric.temperatureGpu'},
		    {name: 'power.draw', type: 'int', mapping:'gpumetric.powerDraw'},
		    {name: 'queryTime', mapping:'queryTime'}
		    ],
		    idField: 'metricId'
	});
    
	var metric_ds = new Ext.data.Store({
	  autoLoad: true,
	  model:'Metric',
	  pageSize: 50,
	  proxy: {
	        type: 'ajax',
	        url:'/processmetrics_42',
	        reader: {
	            type: 'json',
	      	    totalProperty: 'totalElements',
	    	    successProperty: 'success',
	            root: 'content'
	        }
	  }
	  //remoteSort: true
	});

    Ext.define('App.metricGrid', {
    	id : 'metricGridPanel',
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.metricgrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{id:'metric.id',text: "id", sortable: true, dataIndex: 'id'},
                {id:'metric.cpu.percent',text: "cpu.percent", sortable: true, dataIndex: 'cpu.percent'},
                {id:'metric.cpu.memory.usage',text: "cpu.memory.usage", sortable: true, dataIndex: 'cpu.memory.usage'},
                {id:'metric.utilization.gpu',text: "utilization.gpu", sortable: true, dataIndex: 'utilization.gpu'},
                {id:'metric.gpu.memory.usage',text: "gpu.memory.usage", sortable: true, dataIndex: 'gpu.memory.usage'},
                {id:'metric.queryTime',text: "queryTime", width: 150, sortable: true, dataIndex: 'queryTime'},
                {id:'metric.temperature.gpu',text: "temperature.gpu", sortable: true, dataIndex: 'temperature.gpu'},
                {id:'metric.power.draw',text: "power.draw", sortable: true, dataIndex: 'power.draw'},
            	{id:'metric.process.id',text: "process.id", sortable: true, dataIndex: 'processId'},
                {id:'metric.gpu.id',text: "gpu.id", sortable: true, dataIndex: 'gpu.id'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = metric_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
            	itemId: 'metricBbar',
                store: metric_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });