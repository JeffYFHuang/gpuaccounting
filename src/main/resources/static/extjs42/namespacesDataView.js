    //{"id":2,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":4,"limitsMemory":"16Gi","limitsNvidiaComGpu":2,"requestsCpu":4,"requestsMemory":"16Gi","requestsNvidiaComGpu":2}
    // create the data store
	Ext.define('Namespace', {
	    extend: 'Ext.data.Model',
	    fields: [
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
		    ]
	});

	var namespace_ds = new Ext.data.Store({
		  //autoLoad: true,
		  model:'Namespace',
		  proxy: {
		        type: 'ajax',
		        url:'/namespaces',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 
	
    var dataview = Ext.create('Ext.view.View', {
        deferInitialRefresh: false,
        store: namespace_ds,
        tpl  : Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="phone">',
                '<img width="20" height="20" src="./images/user.jpg" />',
                '<strong>{name}</strong>',
                '</div>',
            '</tpl>'
        ),

        /*plugins : [
            Ext.create('Ext.ux.DataView.Animated', {
                duration  : 550,
                idProperty: 'id'
            })
        ],*/
        id: 'phones',

        itemSelector: 'div.phone',
        overItemCls : 'phone-hover',
        multiSelect : false,
        autoScroll  : true,
        listeners:{
         itemclick:function(v, record, item, index, e) {
   	           var id = record.get('id');
   	           pod_ds.removeAll();
   	           pod_ds.load({params:{start:0, limit:20, namespaceId:id}});
   	       }  
        }
    });

    var tb = Ext.create('Ext.toolbar.Toolbar');

    tb.add(formPanel);

    /*tb.add({
    	xtype: 'datefield',
        fieldLabel: 'End Date',
        name: 'enddt',
        itemId: 'enddt',
        vtype: 'daterange',
        startDateField: 'startdt' // id of the start date field
    });*/

    var namespacesDataViewPanel = new Ext.Panel({
        //title: 'namespaces',
        layout: 'fit',
        items : dataview,
        autoScroll  : true,
        bbar : tb
        //height: 615,
        //width : 800,
    });

    namespace_ds.load({params:{start:0, limit:20}});
//});