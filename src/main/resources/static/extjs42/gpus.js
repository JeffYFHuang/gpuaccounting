    //{"id":1,"uuid":"GPU-1dc1efe9-ae19-26bc-7ce5-b57a27a821aa","name":"Tesla V100-SXM3-32GB","enforcedpowerlimit":350,"memorytotal":32480,"hostname":"dgx-18-04-op1"}
    // create the data store
	Ext.define('Gpu', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'id', type: 'int', mapping:'id'},
		    {name: 'hostname', mapping:'hostname'},
		    {name: 'enforced.power.limit', type: 'int', mapping:'enforcedpowerlimit'},
		    {name: 'memory.total', type: 'int', mapping:'memorytotal'},
		    {name: 'uuid', mapping:'uuid'},
		    {name: 'name', mapping:'name'},
		    {name: 'used', mapping:'used'},
		    {name: 'user', mapping:'user'},
		    {name: 'utilizationGpu', mapping:'currentgpumetric.utilizationGpu'},
		    {name: 'memoryUsed', mapping:'currentgpumetric.memoryUsed'}
		    ]
	});

	var gpu_ds = new Ext.data.Store({
          pageSize: 128,
		  autoLoad: true,
		  model:'Gpu',
		  proxy: {
		        type: 'ajax',
		        url:'/gpus',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	});

	
    Ext.define('App.gpuGrid', {
        extend: 'Ext.grid.Panel',
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.gpugrid',
        height: this.height,
        stripeRows: true,
        columnLines: true,
        viewConfig: {
        	loadMask: false
    	},
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
        	function renderUsed(value) {
        		if (value == 1) {
        		return "<span style='color:red;font-weight:bold;'>Y</span>";
        		} else {
        		return "<span style='color:green;font-weight:bold;'>N</span>";
        		}
        	}

            function rendererBar (value, meta, record) {
            	if (value != 1 ) return "";
	            var id = Ext.id();
	            //alert(record.get('memoryUsed')/record.get('memory.total'));
	            Ext.defer(function (id) {
	                var chart = Ext.create('Ext.chart.Chart', {
	                    animate: true,
                        style: 'background:#fff',
                        shadow: true,
	                    store: {
					       fields: ['id', 'value'],
					       data: [{
					           id: 'gpu',
					           value: record.get('utilizationGpu')
					       },{
					           id: 'mem',
					           value: record.get('memoryUsed')/record.get('memory.total') * 100
					       }]
					    },
	                    width: 150,
	                    height: 100,
					    axes: [{
			                type: 'Numeric',
			                position: 'left',
			                fields: ['value'],
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
			                position: 'bottom',
			                fields: ['id'],
			                title: '',
			                dashSize: 0
			                //hidden: true
			            }],
			            series: [{
			                type: 'column',
			                axis: 'left',
			                label: {
			                    display: 'insideEnd',
			                    field: 'value',
			                    renderer: Ext.util.Format.numberRenderer('0'),
			                    orientation: 'horizontal',
			                    color: '#333',
			                    'text-anchor': 'right',
			                    contrast: true
			                },
			                xField: 'id',
			                yField: ['value'],
			                //color renderer
			                renderer: function(sprite, record, attr, index, store) {
			                    var fieldValue = Math.random() * 20 + 10;
			                    //alert(attr);
			                    var value = (record.get('value') >> 0) % 5;
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

        	function renderUser(value) {
        		if (value != null) {
        			var user = namespace_ds.findRecord('id', value);
        			return "<span style='color:green;font-weight:bold;'>" + user.get('name') + "</span>";
        		}
        		return ''
        	}

            this.columns = [
            	{text: "id", sortable: true, width: 40, dataIndex: 'id'},
            	{text: "utilization(%)", sortable: true, flex: 0.25, dataIndex: 'used', renderer:rendererBar},
            	{text: "occupied user", sortable: true, flex: 0.25, dataIndex: 'user', renderer:renderUser},
                {text: "hostname", sortable: true, flex: 0.25, dataIndex: 'hostname'},
                {text: "memory.total", sortable: true, width: 100, dataIndex: 'memory.total'},
                {text: "enforced.power.limit", sortable: true, width: 100, dataIndex: 'enforced.power.limit'},
                {text: "uuid", sortable: true, flex: 0.25, dataIndex: 'uuid'},
                {text: "name", sortable: true, width: 150, dataIndex: 'name'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = gpu_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                store: gpu_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });

            this.callParent(arguments);
        }
    });
//});