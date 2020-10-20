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
		    {name: 'containers', mapping:'containers'},
		    {name: 'requestsCpu', mapping:'containers[0].requestsCpu'},
		    {name: 'requestsMemory', mapping:'containers[0].requestsMemory'},
		    {name: 'requestsNvidiaComGpu', mapping:'containers[0].requestsNvidiaComGpu'}
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
	      pageSize: 128,
		  autoLoad: true,
		  groupField: 'namespaceId',  
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
		  }/*, listeners: {
		        load: {
		            fn: function(store, records, options){
		            	store.each(function(r) {
		            		//r.data.requestsCpu == parseInt(r.data.containers[0]['requestsCpu']);

							alert(r.data.containers[0].requestsCpu);
		            	}, this);

		            }
		        },
		        exception: function(misc) {
		            alert("Holy cow, we're getting an exception!");
		        }
		  }*/
		  //remoteSort: true
	}); 

    function renderUser(value) {
		if (value != null) {
			var user = namespace_ds.findRecord('id', value);
			return "<span style='color:green;font-weight:bold;'>" + user.get('name') + "</span>";
		}
		return ''
	};

    Ext.define('App.podGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.podgrid',
        height: this.height,
        stripeRows: true,
        columnLines: true,
        viewConfig: {
        	loadMask: false
    	},
        features: [
            {
                ftype: 'grouping',
                groupHeaderTpl: 'Namespace: {[renderUser(values.rows[0].data.namespaceId)]} ({rows.length})',
                startCollapsed: true
            }
        ],
        // override
        initComponent : function() {
            // Pass in a column model definition
            // Note that the DetailPageURL was defined in the record definition but is not used
            // here. That is okay.

            function rendererGpu (value, meta, record) {
            	if (value == null ) return "";

				var pod = pod_ds.findRecord('id', value);
				var gpus = pod.get('containers')[0]['gpus'];
				if (gpus.length == 0) return "";

				var data = [];
				for (var gpu in gpus) {
					    data.push({
					    	id: gpus[gpu]['id'],
					    	utilizationGpu: gpus[gpu]['currentgpumetric']['utilizationGpu']
					    });
			    }
	
	            var id = Ext.id();
	            //alert(record.get('memoryUsed')/record.get('memory.total'));
	            Ext.defer(function (id) {
	                var chart = Ext.create('Ext.chart.Chart', {
	                    animate: true,
                        style: 'background:#fff',
                        shadow: false,
	                    store: {
	                       fields: ['id', 'utilizationGpu'],
					       data: data
					    },
	                    width: 150,
	                    height: 100,
					    axes: [{
			                type: 'Numeric',
			                position: 'bottom',
			                fields: ['utilizationGpu'],
			                dashSize: 0,
			                hidden: true,
			                label: {
			                   renderer: Ext.util.Format.numberRenderer('0,0')
			                },
			                title: '',
			                minimum: 0,
							maximum: 100
			            }, {
			                type: 'Category',
			                position: 'left',
			                fields: ['id'],
			                title: '',
			                dashSize: 0,
			                hidden: false
			            }],
			            series: [{
			                type: 'bar',
			                axis: 'left',
			                label: {
			                    display: 'insideEnd',
			                    field: 'utilizationGpu',
			                    renderer: Ext.util.Format.numberRenderer('0'),
			                    orientation: 'horizontal',
			                    color: '#333',
			                    'text-anchor': 'right',
			                    contrast: true
			                },
			                xField: 'id',
			                yField: ['utilizationGpu'],
			                //color renderer
			                renderer: function(sprite, record, attr, index, store) {
			                    var fieldValue = Math.random() * 20 + 10;
			                    //alert(record.get('utilizationGpu'));
			                    var value = (record.get('utilizationGpu') >> 0) % 5;
			                    var color = ['rgb(213, 70, 121)', 
			                                 'rgb(44, 153, 201)', 
			                                 'rgb(146, 6, 157)', 
			                                 'rgb(49, 149, 0)', 
			                                 'rgb(249, 153, 0)'][value];
			                    return Ext.apply(attr, {
			                        fill: color
			                    });
			                }
			            }],
	                    renderTo: id
	                });
	            }, 50, undefined, [id]);
	            return "<div id='" + id + "'></div>";//<div>" + record.get('utilizationGpu') + "%</div><div>" + record.get('utilizationGpu') + "%</div>";
            }
 
             function rendererMem (value, meta, record) {
            	if (value == null ) return "";

				var pod = pod_ds.findRecord('id', value);
				var gpus = pod.get('containers')[0]['gpus'];
				if (gpus.length == 0) return "";
				var data = [];

				for (var gpu in gpus) {
					    data.push({
					    	id: gpus[gpu]['id'],
					    	memoryUsed: gpus[gpu]['currentgpumetric']['memoryUsed'] / gpus[gpu]['memorytotal'] * 100
					    });
			    }
	
	            var id = Ext.id();
	            //alert(record.get('memoryUsed')/record.get('memory.total'));
	            Ext.defer(function (id) {
	                var chart = Ext.create('Ext.chart.Chart', {
	                    animate: true,
                        style: 'background:#fff',
                        shadow: false,
	                    store: {
	                       fields: ['id', 'memoryUsed'],
					       data: data
					    },
	                    width: 150,
	                    height: 100,
					    axes: [{
			                type: 'Numeric',
			                position: 'bottom',
			                fields: ['memoryUsed'],
			                dashSize: 0,
			                hidden: true,
			                label: {
			                   renderer: Ext.util.Format.numberRenderer('0,0')
			                },
			                title: '',
			                minimum: 0,
							maximum: 100
			            }, {
			                type: 'Category',
			                position: 'left',
			                fields: ['id'],
			                title: '',
			                dashSize: 0,
			                hidden: true
			            }],
			            series: [{
			                type: 'bar',
			                axis: 'left',
			                label: {
			                    display: 'insideEnd',
			                    field: 'memoryUsed',
			                    renderer: Ext.util.Format.numberRenderer('0'),
			                    orientation: 'horizontal',
			                    color: '#333',
			                    'text-anchor': 'right',
			                    contrast: true
			                },
			                xField: 'id',
			                yField: ['memoryUsed'],
			                //color renderer
			                renderer: function(sprite, record, attr, index, store) {
			                    var fieldValue = Math.random() * 20 + 10;
			                    //alert(record.get('memoryUsed'));
			                    var value = (record.get('memoryUsed') >> 0) % 5;
			                    var color = ['rgb(213, 70, 121)', 
			                                 'rgb(44, 153, 201)', 
			                                 'rgb(146, 6, 157)', 
			                                 'rgb(49, 149, 0)', 
			                                 'rgb(249, 153, 0)'][value];
			                    return Ext.apply(attr, {
			                        fill: color
			                    });
			                }
			            }],
	                    renderTo: id
	                });
	            }, 50, undefined, [id]);
	            return "<div id='" + id + "'></div>";//<div>" + record.get('utilizationGpu') + "%</div><div>" + record.get('utilizationGpu') + "%</div>";
            }

		    function renderGPUs(value) {
		    //alert(value);
				if (value != null) {
					var pod = pod_ds.findRecord('id', value);
					var gpus = pod.get('containers')[0]['gpus'];
					var rstr = '';
					//alert(gpus[0]['id']);
					for (var gpu in gpus) {
					    //alert(gpus[gpu]['id']);
						rstr += "<span style='color:green;font-weight:bold;'>" + gpus[gpu]['id'] + "</span> "
    					//alert("o." + prop + " = " + pod.get('containers')[0][prop]);
					}
					return rstr;
				}
				return ''
			};

            this.columns = [
            	//{text: "user", sortable: true, dataIndex: 'namespaceId', flex: 0.1, renderer: renderUser},
                {text: "name", sortable: true, dataIndex: 'name', flex: 0.04},
                //{id:'phase',text: "phase", sortable: true, dataIndex: 'phase'},
                {text: "startTime", sortable: true, dataIndex: 'startTime', flex: 0.1},
                {text: "queryTime", sortable: true, dataIndex: 'queryTime', flex: 0.1},
                {text: "hostname", sortable: true, dataIndex: 'hostname', flex: 0.07},
                {text: "requestsCPU", sortable: true, dataIndex: 'requestsCpu', flex: 0.06},
                {text: "requestsMemory", sortable: true, dataIndex: 'requestsMemory', flex: 0.06},
                {text: "GPU(%)", sortable: true, dataIndex: 'id', flex: 0.1, renderer: rendererGpu},
                {text: "GPUMem(%)", sortable: true, dataIndex: 'id', flex: 0.1, renderer: rendererMem}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = pod_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                //pageSize: 20,
                store: pod_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent();
        }, 
        listeners: {
             cellclick: function (grd, rowIndex, colIndex, e) {
                           var record = grd.getStore().getAt(rowIndex);
                           var record = grd.getStore().getAt(rowIndex);
                           //alert('click');
                        }
        }
    });