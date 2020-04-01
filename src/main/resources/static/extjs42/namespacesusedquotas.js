    //{"id":2,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":4,"limitsMemory":"16Gi","limitsNvidiaComGpu":2,"requestsCpu":4,"requestsMemory":"16Gi","requestsNvidiaComGpu":2}
    // create the data store

	Ext.define('NamespaceUsedQuota', {
	    extend: 'Ext.data.Model',
	    fields: [
	    	{name: 'id', type: 'int', mapping:'id'},
		    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
		    {name: 'limitsMemory', mapping:'limitsMemory'},
		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
		    {name: 'requestsMemory', mapping:'requestsMemory'},
		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
		    {name: 'startTime', mapping:'startTime'},
		    {name: 'queryTime', mapping:'queryTime'}
		    ]
	});

	var namespaceusedquota_ds = new Ext.data.Store({
		  autoLoad: true,
          pageSize: 50,
		  model:'NamespaceUsedQuota',
		  proxy: {
		        type: 'ajax',
		        url:'/namespaceusedresourcequotas',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }, listeners: {
		        load: {
		            fn: function(store, records, options){
		            	var data = [];

		            	store.each(function(r) {
			            	var limitsMemory = r.data.limitsMemory == undefined ? null : parseInt(r.data.limitsMemory);
			            	var requestsMemory = r.data.requestsMemory == undefined ? null : parseInt(r.data.requestsMemory);
			            	var startTime = r.data.startTime == undefined ? null : r.data.startTime;
			            	var queryTime = r.data.queryTime == undefined ? null : r.data.queryTime;

		                    data.push({
		                    	name: r.data.name,
		            		    namespaceId: r.data.namespaceId,
		            		    limitsCpu: r.data.limitsCpu,
		            		    limitsMemory: limitsMemory,
		            		    limitsNvidiaComGpu: r.data.limitsNvidiaComGpu,
		            		    requestsCpu: r.data.requestsCpu,
		            		    requestsMemory: requestsMemory,
		            		    requestsNvidiaComGpu: r.data.requestsNvidiaComGpu,
		            		    time: r.data.startTime});

		                    data.push({
		                    	name: r.data.name,
		            		    namespaceId: r.data.namespaceId,
		            		    limitsCpu: r.data.limitsCpu,
		            		    limitsMemory: limitsMemory,
		            		    limitsNvidiaComGpu: r.data.limitsNvidiaComGpu,
		            		    requestsCpu: r.data.requestsCpu,
		            		    requestsMemory: requestsMemory,
		            		    requestsNvidiaComGpu: r.data.requestsNvidiaComGpu,
		            		    time: r.data.queryTime});
		                    
		                    //alert(parseInt(r.data.requestsMemory));
		            	}, this);

		            	chartusedquota_ds.removeAll();
		            	chartusedquota_ds.sync();
		            	chartusedquota_ds.loadData(data);
		            	//alert(chartusedquota_ds.getCount());
		            }
		        },
		        exception: function(misc) {
		            alert("Holy cow, we're getting an exception!");
		        }
		  }
		  //remoteSort: true
	}); 

	 // Simple ComboBox using the data store
    Ext.define('App.userComboBox', {
        extend: 'Ext.form.field.ComboBox',
        alias: 'widget.userComboBox',
        fieldLabel: 'Select a user',
        displayField: 'name',
        width: 300,
        labelWidth: 130,
        store: namespace_ds,
        queryMode: 'local',
        typeAhead: true,
        listeners: {
        	select: function(ele, recs, idx) {
        		//ele.lastSelectEvent = ele.value;
        		var id = recs[0].get('id');
        		namespaceusedquota_ds.load({params:{namespaceId:id}});
            },
            scope: this
        }
    });

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

    Ext.define('App.namespaceUsedQuotaGrid', {
        extend: 'Ext.grid.Panel',
        layout: 'fit',
        height: 200,
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.namespaceUsedQuotaGrid',
        //height: this.height,
        stripeRows: true,
        columnLines: true,
        // override
        /**
         * Custom function used for column renderer
         * @param {Object} val
         */
        change: function(val) {
            if (val > 0) {
                return '<span style="color:green;">' + val + '</span>';
            } else if (val < 0) {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        },

        /**
         * Custom function used for column renderer
         * @param {Object} val
         */
        pctChange: function(val) {
            if (val > 0) {
                return '<span style="color:green;">' + val + '%</span>';
            } else if (val < 0) {
                return '<span style="color:red;">' + val + '%</span>';
            }
            return val;
        },

        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.
            this.columns = [
            	//{id:'namespacequota.id',text: "id", sortable: true, width: 70, dataIndex: 'id'},
            	{id:'namespacequota.namespaceId',text: "namespaceId", sortable: true, width: 70, dataIndex: 'namespaceId'},
                {id:'namespacequota.limitsCpu',text: "limits.cpu", sortable: true, dataIndex: 'limitsCpu'},
                {id:'namespacequota.limitsMemory',text: "limits.memory", sortable: true, dataIndex: 'limitsMemory'},
                {id:'namespacequota.limitsNvidiaComGpu',text: "limits.nvidia.com/gpu", sortable: true, dataIndex: 'limitsNvidiaComGpu'},
                {id:'namespacequota.requestsCpu',text: "requests.cpu", sortable: true, dataIndex: 'requestsCpu'},
                {id:'namespacequota.requestsMemory',text: "requests.memory", sortable: true, dataIndex: 'requestsMemory'},
                {id:'namespacequota.requestsNvidiaComGpu',text: "requests.nvidia.com/gpu", sortable: true, dataIndex: 'requestsNvidiaComGpu'},
                {id:'namespacequota.startTime',text: "startTime", sortable: true, flex: 0.5, dataIndex: 'startTime'},
                {id:'namespacequota.queryTime',text: "queryTime", sortable: true, flex:0.5, dataIndex: 'queryTime'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = namespaceusedquota_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                store: namespaceusedquota_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent(arguments);
        },
        tbar: {
        	xtype: 'toolbar',
            updateQuota: function() {
            	sd = this.up().down().down('#startdt').getValue();
            	st = this.up().down().down('#startt').getValue();
            	ed = this.up().down().down('#enddt').getValue();
            	et = this.up().down().down('#endt').getValue();

                if (sd == null) {
                	alert('Please select a start date time.');
                	return;
                }

                if (ed == null) {
                	alert('Please select an end date time.');
                	return;
                }

                //alert(startDt + " " + endDt);
                startDt = toCSTString2(sd, st);
                endDt = toCSTString2(ed, et);
                if (startDt >= endDt) {
                	alert("End date time should be greater than start date time!");
                	return;
                }

            	namespaceusedquota_ds.proxy.extraParams.startDateTime = startDt;
            	namespaceusedquota_ds.proxy.extraParams.endDateTime = endDt;

            	namespaceusedquota_ds.load();
            },
        	items: [
        		{
        			xtype: 'datefield',
        			labelWidth: 60,
                    fieldLabel: ' Start Date',
                    name: 'startdt',
                    itemId: 'startdt',
                    //vtype: 'daterange',
                    //endDateField: 'enddt' // id of the end date field
                    listeners: {
                    	change: function () {
                    		this.up().down('#enddt').setMinValue(this.getValue());
                    		this.up().updateQuota();
                        }
                    }
                }, {
                	xtype: 'timefield',
                    reference: 'timeField',
                    itemId: 'startt',
                    format: 'H:i',
                    value: '00:00',
                    maxValue: '24:00',
                    increment: 15,
                    width: 80,
                    listeners: {
                    	select: function () {
                    		this.up().updateQuota();
                        }
                    }
                }, {
                	xtype: 'datefield',
                	labelWidth: 60,
                    fieldLabel: ' End Date',
                    name: 'enddt',
                    itemId: 'enddt',
                    //vtype: 'daterange',
                    startDateField: 'startdt', // id of the start date field
                    listeners: {
                    	change: function () {
                    		//var date = field.parseDate(this.getValue());
                    		this.up().down('#startdt').setMaxValue(this.getValue());
                    		this.up().updateQuota();
                        }
                    }
                }, {
                	xtype: 'timefield',
                    reference: 'timeField',
                    itemId: 'endt',
                    format: 'H:i',
                    value: '00:00',
                    maxValue: '24:00',
                    increment: 15,
                    width: 80,
                    listeners: {
                    	select: function () {
                    		this.up().updateQuota();
                        }
                    }
                }
        	]
        }
    });
