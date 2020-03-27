/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/

//Ext.onReady(function(){

    // example of custom renderer function
    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    // example of custom renderer function
    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }

    var processId = null;
    // create the data store
    var metric_proxy = new Ext.data.HttpProxy({
    	url:'/processmetrics'
	});

// {"id":1,"processId":1,"gpumetricId":15,"gpuMemoryUsage":31089,"cpuPercent":0.0,"cpuMemoryUsage":2979635200,"queryTime":"2020-03-17T08:20:00.855911","gpumetric":{"id":15,"gpuId":15,"temperatureGpu":37,"utilizationGpu":0,"powerDraw":70,"memoryUsed":31100,"queryTime":"2020-03-17T08:20:00.855911"}}
	var metric_reader = new Ext.data.JsonReader({
	  totalProperty: 'totalElements',
	  successProperty: 'success',
	  root: 'content'
	}, [
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
	]);
	
	var metric_ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: metric_proxy,
	  reader: metric_reader
	  //params:{start:0, limit:20}
	  //remoteSort: true
	});    

    // create the Grid
    var metricGrid = new Ext.grid.GridPanel({
        store: metric_ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 50, dataIndex: 'id'},
            {id:'cpu.percent',header: "cpu.percent", sortable: true, dataIndex: 'cpu.percent'},
            {id:'cpu.memory.usage',header: "cpu.memory.usage", sortable: true, dataIndex: 'cpu.memory.usage'},
            {id:'utilization.gpu',header: "utilization.gpu", sortable: true, dataIndex: 'utilization.gpu'},
            {id:'gpu.memory.usage',header: "gpu.memory.usage", sortable: true, dataIndex: 'gpu.memory.usage'},
            {id:'temperature.gpu',header: "temperature.gpu", sortable: true, dataIndex: 'temperature.gpu'},
            {id:'power.draw',header: "power.draw", sortable: true, dataIndex: 'power.draw'},
        	{id:'process.id',header: "process.id", sortable: true, dataIndex: 'processId'},
            {id:'gpu.id',header: "gpu.id", sortable: true, dataIndex: 'gpu.id'},
            {id:'queryTime',header: "queryTime", sortable: true, width: 150, dataIndex: 'queryTime'}
        ],
        stripeRows: true,
        //autoExpandColumn: 'queryTime',
        //height:250,
        //width:"50%",
        frame:true,
        title:'metrices',
        flex:7,

        //plugins: new Ext.ux.PanelResizer({
        //    minHeight: 100
        //}),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: metric_ds,
            displayInfo: true

            //plugins: new Ext.ux.ProgressBarPager()
        }),
        listeners:{  
 	       rowdblclick : function(grid, rowIndex){  
 	           alert("rowdblclick");
 	       },
 	       rowclick:function(grid, rowIndex){  
 	           var record = grid.getStore().getAt(rowIndex);
 	           var gpuid = record.get('gpu.id');
 	           gpu_ds.load({params:{start:0, limit:20, id:gpuid}});
 	       }  
        }
    });

    //namespaceGrid.render('grid-example');

    //metric_ds.load({params:{start:0, limit:20}});
//});