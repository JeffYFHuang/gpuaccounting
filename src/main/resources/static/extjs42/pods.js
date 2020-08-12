	Ext.define('Pod', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'name', mapping:'name'},
		    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
		    {name: 'hostname', mapping:'hostname'},
		    {name: 'phase', mapping:'phase'},
		    {name: 'startTime', mapping:'startTime'},
		    {name: 'queryTime', mapping:'queryTime'},
		    {name: 'containers', mapping:'containers'}
		    ]
	});

    function toDate(strDate){
    	var pattern = /(\d{2})\/(\d{2})\/(\d{4})(\d{2}):(\d{2}):(\d{2})CST/;
    	return new Date(strDate.replace(pattern, "$3-$1-$2 $4:$5:$6"));
    }

    //03/30/202011:11:21CST
    function toCSTString2(date0, date1) {
    	return pad(date0.getMonth() + 1) +  
    	'/' + pad(date0.getDate()) + 
    	'/' + date0.getFullYear() +
        '' + pad(date1.getHours()) +
        ':' + pad(date1.getMinutes()) +
        ':' + pad(date1.getSeconds()) +
        'CST';
    }

    function getRequestedHours(startTime, queryTime) {
    	var st = startTime;
    	var dt = queryTime;
		if (namespaceusedquota_ds.proxy.extraParams.startDateTime != undefined) {
			if (startTime == null)
				st = namespaceusedquota_ds.proxy.extraParams.startDateTime;
			else
				if (toDate(st) < toDate(namespaceusedquota_ds.proxy.extraParams.startDateTime))
					st = namespaceusedquota_ds.proxy.extraParams.startDateTime;
		}

		if (namespaceusedquota_ds.proxy.extraParams.endDateTime != undefined)
		{
			if (toDate(namespaceusedquota_ds.proxy.extraParams.endDateTime) < toDate(queryTime))
				dt = namespaceusedquota_ds.proxy.extraParams.endDateTime;
		}
		//alert(namespaceusedquota_ds.proxy.extraParams.startDateTime);
		//startTime = toDate(namespaceusedquota_ds.proxy.extraParams.startDateTime);

    	if (st != null) {
    		//alert(toDate(dt) + "-" + toDate(st));
    		return　Math.abs(toDate(dt) - toDate(st)) / 36e5;
    	}
    	
    	return 0;
    }

    var now = new Date();
    var last30days = new Date();
    last30days.setDate(now.getDate() - 30);
    var nextday = new Date();
    nextday.setDate(now.getDate() + 1);
 
	var pod_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Pod',
		  proxy: {
		        type: 'ajax',
		        url:'/pods',
		        extraParams: {
		        	startDateTime: toCSTString(last30days),
		        	endDateTime: toCSTString(nextday)
		        },
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 

    Ext.define('App.podGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.podgrid',

        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	{text: "id", sortable: true, width: 30, dataIndex: 'id'},
            	{text: "namespace.id", sortable: true, dataIndex: 'namespaceId'},
                {text: "name", sortable: true, dataIndex: 'name'},
                //{id:'phase',text: "phase", sortable: true, dataIndex: 'phase'},
                {text: "startTime", sortable: true, dataIndex: 'startTime'},
                {text: "queryTime", sortable: true, dataIndex: 'queryTime'},
                {text: "hostname", sortable: true, dataIndex: 'hostname'}
                ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = pod_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: pod_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }
    });
//});