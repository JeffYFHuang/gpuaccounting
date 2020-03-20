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

    //{"id":1,"uuid":"GPU-1dc1efe9-ae19-26bc-7ce5-b57a27a821aa","name":"Tesla V100-SXM3-32GB","enforcedpowerlimit":350,"memorytotal":32480,"hostname":"dgx-18-04-op1"}
    // create the data store
    var gpu_proxy = new Ext.data.HttpProxy({
    	url:'/gpus'
	});

	var gpu_reader = new Ext.data.JsonReader({
	  totalProperty: 'totalCount',
	  successProperty: 'success',
	  root: 'data'
	}, [
	    {name: 'id', type: 'int', mapping:'id'},
	    {name: 'hostname', mapping:'hostname'},
	    {name: 'enforced.power.limit', type: 'int', mapping:'enforcedpowerlimit'},
	    {name: 'memory.total', type: 'int', mapping:'memorytotal'},
	    {name: 'uuid', mapping:'uuid'},
	    {name: 'name', mapping:'name'}
	]);
	
	var gpu_ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: gpu_proxy,
	  reader: gpu_reader,
	  params:{start:0, limit:20}
	  //remoteSort: true
	});    

    // create the Grid
    var gpuGrid = new Ext.grid.GridPanel({
        store: gpu_ds,
        columns: [
        	{id:'id',header: "id", sortable: true, width: 30, dataIndex: 'id'},
            {id:'hostname',header: "hostname", sortable: true, width: 100, dataIndex: 'hostname'},
            {id:'memory.total',header: "memory.total", sortable: true, width: 100, dataIndex: 'memory.total'},
            {id:'enforced.power.limit',header: "enforced.power.limit", sortable: true, width: 100, dataIndex: 'enforced.power.limit'},
            {id:'uuid',header: "uuid", sortable: true, width: 150, dataIndex: 'uuid'},
            {id:'name',header: "name", sortable: true, width: 150, dataIndex: 'name'}
        ],
        stripeRows: true,
        //autoExpandColumn: 'uuid',
        height:280,
        //width:"50%",
        frame:true,
        title:'GPUs',

       // plugins: new Ext.ux.PanelResizer({
       //     minHeight: 100
       // }),

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: gpu_ds,
            displayInfo: true

            //plugins: new Ext.ux.ProgressBarPager()
        })
    });

    //namespaceGrid.render('grid-example');

    gpu_ds.load({params:{start:0, limit:20}});
//});