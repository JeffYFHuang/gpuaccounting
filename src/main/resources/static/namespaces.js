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

    //{"id":2,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":4,"limitsMemory":"16Gi","limitsNvidiaComGpu":2,"requestsCpu":4,"requestsMemory":"16Gi","requestsNvidiaComGpu":2}
    // create the data store
    var proxy = new Ext.data.HttpProxy({
    	url:'/namespaces'
	});

	var reader = new Ext.data.JsonReader({
	  totalProperty: 'totalCount',
	  successProperty: 'success',
	  root: 'data'
	}, [
	    {name: 'namespace_id', type: 'int', mapping:'id'},
	    {name: 'name'},
	    {name: 'owner'},
	    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
	    {name: 'limitsMemory', mapping:'limitsMemory'},
	    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
	    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
	    {name: 'requestsMemory', mapping:'requestsMemory'},
	    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'}
	]);
	
	var ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: proxy,
	  reader: reader//,
	  //remoteSort: true
	});    

    // create the Grid
    var namespaceGrid = new Ext.grid.GridPanel({
        store: ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 30, dataIndex: 'id'},
            {id:'name',header: "name", sortable: true, dataIndex: 'name'},
            //{id:'owner',header: "owner", sortable: true, dataIndex: 'owner'},
            {id:'limitsCpu',header: "limits.cpu", sortable: true, dataIndex: 'limitsCpu'},
            {id:'limitsMemory',header: "limits.memory", sortable: true, dataIndex: 'limitsMemory'},
            {id:'limitsNvidiaComGpu',header: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu'},
            {id:'requestsCpu',header: "requests.cpu", sortable: true, dataIndex: 'requestsCpu'},
            {id:'requestsMemory',header: "requests.memory", sortable: true, dataIndex: 'requestsMemory'},
            {id:'requestsNvidiaComGpu',header: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu'}   
        ],
        stripeRows: true,
        //autoExpandColumn: 'name',
        height:280,
        //width:"50%",
        frame:true,
        title:'Namespaces',

        //plugins: new Ext.ux.PanelResizer({
        //    minHeight: 250
        //}),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: ds,
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
 	           pod_ds.removeAll();
 	           pod_ds.load({params:{start:0, limit:20, id:id}});
 	       }  
         }
    });

    //namespaceGrid.render('grid-example');

    ds.load({params:{start:0, limit:20}});
//});