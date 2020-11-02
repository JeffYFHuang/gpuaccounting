//{"id":5240052,"gpuId":51,"temperatureGpu":39,"utilizationGpu":0,"powerDraw":71,"memoryUsed":31100,"queryTime":"2020-10-20T08:12:04.313423"},
	Ext.define('Metric', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'gpuId', type: 'int', mapping:'gpuId'},
		    {name: 'temperatureGpu', type: 'float', mapping:'temperatureGpu'},
		    {name: 'utilizationGpu', type: 'int', mapping:'utilizationGpu'},
		    {name: 'powerDraw', type: 'int', mapping:'powerDraw'},
		    {name: 'memoryUsed', type: 'int', mapping:'memoryUsed'},
		    {name: 'queryTime', mapping:'queryTime'}
		    ]
	});

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

    //"2020-10-20T05:43:37.754658"
    function toTString(date) {
    	return pad(date.getFullYear()) + 
    	"-" + pad(date.getMonth() + 1) +  
    	'-' + pad(date.getDate()) + 
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) + ".000000";
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

    /*var now = new Date();
    var last30days = new Date();
    last30days.setDate(now.getDate() - 30);
    var nextday = new Date();
    nextday.setDate(now.getDate() + 1);*/

    var chart_util_gpu = null;
    var chart_mem_gpu = null;
    var chart_win = null;
    var tStore = null;

	var task = {
	    run: function () {
	        metric_reload();
	    },
	    interval: 10000
	};

	var metric_ds = new Ext.data.Store({
	  autoLoad: false,
	  pageSize: 0,
	  model:'Metric',
	  groupField: 'gpuId',
	  proxy: {
	        type: 'ajax',
	        url:'/gpumetrics',
			noCache: false,
	        reader: {
	            type: 'json',
	      	    totalProperty: 'totalElements',
	    	    successProperty: 'success',
	            root: 'content'
	        }
	  }, listeners: {
		        load: {
		            fn: function(store, records, options){
				        // get groups from store (make sure store is grouped)
				        groups = store.isGrouped() ? store.getGroups() : [],
				        // collect all unique values for the new grouping field
				        groupers = store.collect('gpuId'),
				        // blank array to hold our new field definitions (based on groupers collected from store)
				        fields = [];
				        // first off, we want the xField to be a part of our new Model definition, so add it first
				        fields.push( {name: 'queryTime', type: 'string'} );
				        // now loop over the groupers (unique values from our store which match the gField)
				        for( var i in groupers ) {
				            // for each value, add a field definition...this will give us the flat, in-record column for each group 
				            fields.push( { name: 'g' + groupers[i], type: 'int'} );
				            fields.push( { name: 'm' + groupers[i], type: 'int'} );
				        }
				        // let's create a new Model definition, based on what we determined above
				        Ext.define('GroupedResult', {
				            extend: 'Ext.data.Model',
				            fields: fields
				        });
				        // now create a new store using our new model
				        /*tStore = Ext.create('Ext.data.Store', {
				            model: 'GroupedResult'
				        });*/

				        // now for the money-maker; loop over the current groups in our store
				        tStore.removeAll();
						tStore.clearData();
				        //alert(groups.length);
				        if(groups.length == 0) return;
				        var g_data_length = groups[0].children.length;
				        //alert(g_data_length);
				        for (i = 0; i < g_data_length; i++) {
				            var newModel = Ext.create('GroupedResult');
				            for ( var j in groups ) {
				                curRecord = groups[j].children[i];
				                newModel.set('queryTime', curRecord.get('queryTime'));
				                //if (curRecord.get('utilizationGpu') > 0)
				                //alert(curRecord.get('gpuId') + "-" + curRecord.get('utilizationGpu'));
				                newModel.set("g" + curRecord.get('gpuId'), curRecord.get('utilizationGpu'));
				                newModel.set('m' + curRecord.get('gpuId'), curRecord.get('memoryUsed')/1024);
				            }
				            tStore.add(newModel);
				        }

				        tStore.each(function(record) {
    						console.log(record);
						});
						
						/*var axes_fields = [];
						var g_series = [];
						var m_series = [];
						
						for (var i in groupers) {
						     axes_fields.push('g'+groupers[i], 'm'+groupers[i]);

						     g_series.push({
					            type: 'line',
					            axis: 'left',
					            showMarkers: true,
					            smooth: true,
					            //fill: true,
					            //fillOpacity: 0.5,
					            xField: 'queryTime',
					            yField: 'g'+groupers[i]
					         });
					         
					         m_series.push({
					            type: 'line',
					            axis: 'left',
					            showMarkers: true,
					            smooth: true,
					            //fill: true,
					            //fillOpacity: 0.5,
					            xField: 'queryTime',
					            yField: 'm'+groupers[i]
					         });
					    }

						//if (chart_util_gpu == null)
                        var chart_util_gpu = Ext.create('Ext.chart.Chart', {
					    	flex:1,
					        style: 'background:#000',
					        animate: false,
					        theme: 'Category2',
					        store: tStore,
					        legend: {
					            position: 'right'
					        },
					        axes: [{
					            type: 'Numeric',
					            position: 'left',
					            fields: axes_fields,
					            title: 'gpu(%)',
					            grid: false
					        }, {
					            type: 'Category',
					            position: 'bottom',
					            fields: ['queryTime'],
					            title: 'Time'
					        }],
					        series: g_series
					    });
					    
					    var chart_mem_gpu = Ext.create('Ext.chart.Chart', {
					    	flex:1,
					        style: 'background:#000',
					        animate: false,
					        theme: 'Category2',
					        store: tStore,
					        legend: {
					            position: 'right'
					        },
					        axes: [{
					            type: 'Numeric',
					            position: 'left',
					            fields: axes_fields,
					            title: 'mem(GB)',
					            grid: false
					        }, {
					            type: 'Category',
					            position: 'bottom',
					            fields: ['queryTime'],
					            title: 'Time'
					        }],
					        series: m_series
					    });

						if (chart_win != null) {
						  chart_win.reload();
						} else
						 chart_win = Ext.create('Ext.Window', {
						    width: 600,
						    height: 400,
						    minHeight: 400,
						    minWidth: 550,
						    hidden: false,
						    maximizable: true,
						    autoShow: true,
						    layout: {
						        type: 'vbox',
						        align: 'stretch'
						    },
						    tbar: [{
						        text: 'Save Chart',
						        handler: function() {
						            Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
						                if(choice == 'yes'){
						                    chart.save({
						                        type: 'image/png'
						                    });
						                }
						            });
						        }
						    }, {
						    text: 'Reload Data',
						    handler: function() {
						        // Add a short delay to prevent fast sequential clicks
						        window.loadTask.delay(100, function() {
						           metric_ds.load();
						        });
						    }
						}, {
						        enableToggle: true,
						        pressed: true,
						        text: 'Animate',
						        toggleHandler: function(btn, pressed) {
						            chart_mem_gpu.animate = pressed ? { easing: 'ease', duration: 500 } : false;
						
						            if (chart_mem_gpu.animate == pressed) {
						                Ext.TaskManager.start(task);
									} else {
									    alert('Paused!');
									    Ext.TaskManager.stop(task);
									}
						        }
						    }],
						    items: [chart_util_gpu, chart_mem_gpu]
						  });*/
		            }
		        }
	  }
	  //remoteSort: true
	});

	var pod_ds = new Ext.data.Store({
	      pageSize: 128,
		  autoLoad: true,
		  groupField: 'namespaceId',  
		  model:'Pod',
		  proxy: {
		        type: 'ajax',
		        url:'/pods',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }, listeners: {
		        beforeload: {
		            fn: function(store, records, options){
		            	now = new Date();
						startTime = new Date(now.getTime() - 20000);
						endTime = new Date(now.getTime() + 20000);
						store.proxy.extraParams = {
						        	startDateTime: toCSTString(startTime),
						        	endDateTime: toCSTString(endTime)
					        	};
		            }
		        },
		        exception: function(misc) {
		            alert("Holy cow, we're getting an exception!");
		        }
		  }
		  //remoteSort: true
	}); 

    function metric_reload() {
				//"2020-10-19T09:58:25.534842"
				var now = new Date();
				var endDate = new Date(now.getTime() - 8 * 60 * 60000);
				var startDate = new Date(now.getTime() -  8* 60 * 60000 - 5 * 60000);

				metric_ds.load({params: {startDateTime: toTString(startDate), endDateTime: toTString(endDate)}});
	};

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
                startCollapsed: false
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
             cellclick: function (grd, htmlElement, columnIndex, record) {
             //alert(rowIndex);
                //var pod = grd.getStore().getAt(0);
				var gpus = record.get('containers')[0]['gpus'];

				if (gpus.length == 0) return "";

                var gpuids = [];

				for (var gpu in gpus) {
					gpuids.push(gpus[gpu]['id']);
				}

                path = gpuids.join(',');
                metric_ds.setProxy({
			        type: 'ajax',
			        url: '/gpumetrics/' + path
			    });

		        // blank array to hold our new field definitions (based on groupers collected from store)
		        fields = [];
		        // first off, we want the xField to be a part of our new Model definition, so add it first
		        fields.push( {name: 'queryTime', type: 'string'} );
		        // now loop over the groupers (unique values from our store which match the gField)
		        for( var i in gpuids ) {
		            // for each value, add a field definition...this will give us the flat, in-record column for each group 
		            fields.push( { name: 'g' + gpuids[i], type: 'int'} );
		            fields.push( { name: 'm' + gpuids[i], type: 'int'} );
		        }
		        // let's create a new Model definition, based on what we determined above
		        Ext.define('GroupedResult', {
		            extend: 'Ext.data.Model',
		            fields: fields
		        });

		        // now create a new store using our new model
		        tStore = Ext.create('Ext.data.Store', {
		            model: 'GroupedResult'
		        });

				var axes_fields = [];
				var g_series = [];
				var m_series = [];
				
				for (var i in gpus) {
				     axes_fields.push('g'+gpuids[i], 'm'+gpuids[i]);

				     g_series.push({
			            type: 'line',
			            axis: 'left',
			            showMarkers: true,
			            markerConfig: {
		                    radius: 2,
		                    size: 2
		                },
			            smooth: true,
			            //fill: true,
			            //fillOpacity: 0.5,
			            xField: 'queryTime',
			            yField: 'g'+gpuids[i]
			         });
			         
			         m_series.push({
			            type: 'line',
			            axis: 'left',
			            showMarkers: true,
		                markerConfig: {
		                    radius: 2,
		                    size: 2
		                },
			            smooth: true,
			            //fill: true,
			            //fillOpacity: 0.5,
			            xField: 'queryTime',
			            yField: 'm'+gpuids[i]
			         });
			    }

				//if (chart_util_gpu == null)
                chart_util_gpu = Ext.create('Ext.chart.Chart', {
			    	flex:1,
			        style: 'background:#000',
			        animate: false,
			        //theme: 'Category2',
			        store: tStore,
			        legend: {
			            position: 'right'
			        },
			        axes: [{
			            type: 'Numeric',
			            position: 'left',
			            fields: axes_fields,
			            title: 'gpu(%)',
						minimum: 0
			        }, {
			            type: 'Category',
			            position: 'bottom',
			            fields: ['queryTime'],
			            title: 'Time'
			        }],
			        series: g_series
			    });
			    
			    chart_mem_gpu = Ext.create('Ext.chart.Chart', {
			    	flex:1,
			        style: 'background:#000',
			        animate: false,
			        //theme: 'Category2',
			        store: tStore,
			        legend: {
			            position: 'right'
			        },
			        axes: [{
			            type: 'Numeric',
			            position: 'left',
			            fields: axes_fields,
			            title: 'mem(GB)',
			            minimum: 0
			        }, {
			            type: 'Category',
			            position: 'bottom',
			            fields: ['queryTime'],
			            title: 'Time'
			        }],
			        series: m_series
			    });

				 chart_win = Ext.create('Ext.Window', {
				    title: renderUser(record.get('namespaceId')) + '-' + record.get('name'),
				    style: 'background:#000',
				    width: 600,
				    height: 400,
				    minHeight: 400,
				    minWidth: 550,
				    hidden: false,
				    maximizable: true,
				    autoShow: true,
				    layout: {
				        type: 'vbox',
				        align: 'stretch'
				    },
				    tbar: [{
				        text: 'Save Chart',
				        handler: function() {
				            Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
				                if(choice == 'yes'){
				                    chart.save({
				                        type: 'image/png'
				                    });
				                }
				            });
				        }
				    }, /*{
				    text: 'Reload Data',
				    handler: function() {
				        // Add a short delay to prevent fast sequential clicks
				        window.loadTask.delay(100, function() {
				           metric_ds.load();
				        });
				    }
				},*/ {
				        enableToggle: true,
				        pressed: true,
				        text: 'Animate',
				        toggleHandler: function(btn, pressed) {
				            chart_mem_gpu.animate = pressed ? { easing: 'ease', duration: 500 } : false;
				
				            if (chart_mem_gpu.animate == pressed) {
				                Ext.TaskManager.start(task);
							} else {
							    alert('Paused!');
							    Ext.TaskManager.stop(task);
							}
				        }
				    }],
				    items: [chart_util_gpu, chart_mem_gpu]
				  });
			      metric_reload();
            }
        }
    });