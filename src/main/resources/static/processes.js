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

    // create the data store
    var process_proxy = new Ext.data.HttpProxy({
    	url:'/processes'
	});

//    {"id":1,"pid":32399,"nspid":4026551453,"containerId":5,"command":"python3","fullCommand":"['/usr/bin/python3', '-m', 'ipykernel_launcher', '-f', '/home/jovyan/.local/share/jupyter/runtime/kernel-05d873a3-f9e8-4b97-aafd-d1bf80520988.json']","startTime":"2020-03-16 17:56:55"}
	var process_reader = new Ext.data.JsonReader({
	  totalProperty: 'totalCount',
	  successProperty: 'success',
	  root: 'data'
	}, [
	    {name: 'id', type: 'int', mapping:'id'},
	    {name: 'pid', type: 'int', mapping:'pid'},
	    {name: 'nspid', type: 'int', mapping:'nspid'},
	    {name: 'containerId', type: 'int', mapping:'containerId'},
	    {name: 'command', mapping:'command'},
	    {name: 'fullCommand', mapping:'fullCommand'},
	    {name: 'startTime', mapping:'startTime'},
	    {name: 'queryTime', mapping:'queryTime'}
	]);
	
	var process_ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: process_proxy,
	  reader: process_reader//,
	  //remoteSort: true
	});    

    // create the Grid
    var processGrid = new Ext.grid.GridPanel({
        store: process_ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 30, dataIndex: 'id'},
        	{id:'container.id',header: "container.id", sortable: true, dataIndex: 'containerId'},
            {id:'pid',header: "pid", sortable: true, dataIndex: 'pid'},
            {id:'startTime',header: "startTime", sortable: true, dataIndex: 'startTime'},
            {id:'queryTime',header: "queryTime", sortable: true, dataIndex: 'queryTime'},
            {id:'fullCommand',header: "fullCommand", sortable: true, dataIndex: 'fullCommand'},
            {id:'nspid',header: "nspid", sortable: true, dataIndex: 'nspid'}
        ],
        stripeRows: true,
        //autoExpandColumn: 'fullCommand',
        //height:250,
        //width:"50%",
        frame:true,
        title:'processes',
        flex:3.5,

        //plugins: new Ext.ux.PanelResizer({
        //    minHeight: 100
        //}),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: process_ds,
            displayInfo: true

            //plugins: new Ext.ux.ProgressBarPager()
        }),
        listeners:{  
	       rowdblclick : function(grid, rowIndex){  
	           alert("rowdblclick");
	       },
	       rowclick:function(grid, rowIndex){  
	           var record = grid.getStore().getAt(rowIndex);
	           var id = record.get('id');
	           metric_ds.baseParams = {
	        	   processId:id
	           };
	           metric_ds.removeAll();
	           metric_ds.load({params:{start:0, limit:20}});
	       }  
         }
    });

    //namespaceGrid.render('grid-example');

    process_ds.load({params:{start:0, limit:20}});
//});