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
    var container_proxy = new Ext.data.HttpProxy({
    	url:'/containers'
	});

//    {"id":1,"podId":1,"name":"test-image1","limitsCpu":1,"limitsMemory":"8Gi","limitsNvidiaComGpu":1,"requestsCpu":1,"requestsMemory":"8Gi","requestsNvidiaComGpu":1,"nspid":4026551091}
	var container_reader = new Ext.data.JsonReader({
	  totalProperty: 'totalCount',
	  successProperty: 'success',
	  root: 'data'
	}, [
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
	]);
	
	var container_ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: container_proxy,
	  reader: container_reader//,
	  //remoteSort: true
	});    

    // create the Grid
    var containerGrid = new Ext.grid.GridPanel({
        store: container_ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 30, dataIndex: 'id'},
        	{id:'pod.id',header: "pod.id", sortable: true, dataIndex: 'podId'},
            {id:'name',header: "name", sortable: true, dataIndex: 'name'},
            {id:'nspid',header: "nspid", sortable: true, dataIndex: 'nspid'},
            {id:'limitsCpu',header: "limits.cpu", sortable: true, dataIndex: 'limitsCpu'},
            {id:'limitsMemory',header: "limits.memory", sortable: true, dataIndex: 'limitsMemory'},
            {id:'limitsNvidiaComGpu',header: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu'},
            {id:'requestsCpu',header: "requests.cpu", sortable: true, dataIndex: 'requestsCpu'},
            {id:'requestsMemory',header: "requests.memory", sortable: true, dataIndex: 'requestsMemory'},
            {id:'requestsNvidiaComGpu',header: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu'}
        ],
        stripeRows: true,
        //autoExpandColumn: 'name',
        height:250,
        //width:"50%",
        frame:true,
        title:'Containers',

        //plugins: new Ext.ux.PanelResizer({
        //    minHeight: 100
        //}),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: container_ds,
            displayInfo: true

            //plugins: new Ext.ux.ProgressBarPager()
        })
    });

    //namespaceGrid.render('grid-example');

    container_ds.load({params:{start:0, limit:20}});
//});