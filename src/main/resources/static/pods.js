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

    //{"id":1,"name":"test-image1-0","startTime":"03/06/202008:14:28UTC","namespaceId":2,"hostname":"dgx-18-04-op1","phase":"Running"}
    // create the data store
    var pod_proxy = new Ext.data.HttpProxy({
    	url:'/pods'
	});

	var pod_reader = new Ext.data.JsonReader({
	  totalProperty: 'totalCount',
	  successProperty: 'success',
	  root: 'data'
	}, [
	    {name: 'id', type: 'int', mapping:'id'},
	    {name: 'name', mapping:'name'},
	    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
	    {name: 'hostname', mapping:'hostname'},
	    {name: 'phase', mapping:'phase'},
	    {name: 'startTime', mapping:'startTime'}
	]);
	
	var pod_ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: pod_proxy,
	  reader: pod_reader//,
	  //remoteSort: true
	});    

    // create the Grid
    var podGrid = new Ext.grid.GridPanel({
        store: pod_ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 30, dataIndex: 'id'},
        	{id:'namespace.id',header: "namespace.id", sortable: true, dataIndex: 'namespaceId'},
            {id:'name',header: "name", sortable: true, dataIndex: 'name'},
            //{id:'phase',header: "phase", sortable: true, dataIndex: 'phase'},
            {id:'startTime',header: "startTime", sortable: true, dataIndex: 'startTime'},
            {id:'hostname',header: "hostname", sortable: true, dataIndex: 'hostname'}
        ],
        stripeRows: true,
        //autoExpandColumn: 'name',
        height:280,
        //width:"50%",
        frame:true,
        title:'Pods',

       // plugins: new Ext.ux.PanelResizer({
       //     minHeight: 100
       // }),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: pod_ds,
            displayInfo: true

            //plugins: new Ext.ux.ProgressBarPager()
        })
    });

    //namespaceGrid.render('grid-example');

    pod_ds.load({params:{start:0, limit:20}});
//});