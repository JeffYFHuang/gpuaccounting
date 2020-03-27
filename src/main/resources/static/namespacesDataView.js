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
	    {name: 'id', type: 'int', mapping:'id'},
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
	]);
	
	var ds = new Ext.data.Store({
	  autoLoad: true,
	  proxy: proxy,
	  reader: reader//,
	  //remoteSort: true
	});    

    // create the Grid
    var dataview = new Ext.DataView({
        store: ds,
        tpl  : new Ext.XTemplate(
            '<ul>',
                '<tpl for=".">',
                    '<li class="phone">',
                        '<img width="20" height="20" src="./images/user.jpg" />',
                        '<strong>{name}</strong>',
                    '</li>',
                '</tpl>',
            '</ul>'
        ),

        id: 'phones',
        
        itemSelector: 'li.phone',
        overClass   : 'phone-hover',
        singleSelect: true,
        //multiSelect : true,
        autoScroll  : true,
        listeners:{  
 	      click:function(grid, rowIndex){  
 	           var record = grid.getStore().getAt(rowIndex);
 	           var id = record.get('id');
 	           pod_ds.removeAll();
 	           pod_ds.load({params:{start:0, limit:20, id:id}});
 	       }  
         }
    });

    var namespacesDataViewPanel = new Ext.Panel({
        title: 'namespaces',
        layout: 'fit',
        items : dataview
        //height: 615,
        //width : 800,
    });

    ds.load({params:{start:0, limit:20}});
//});