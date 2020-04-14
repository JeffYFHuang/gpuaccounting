Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', './ux/DataView/');
Ext.Loader.setPath("Ext.ux.DateTimePicker", "./ux/DateTimePicker.js");
Ext.Loader.setPath("Ext.ux.DateTimeField", "./ux/DateTimeField.js");

Ext.require([
    'Ext.data.*',
    'Ext.util.*',
    'Ext.panel.*',
    'Ext.layout.container.Border',
    'Ext.view.View',
    'Ext.ux.DataView.Animated',
    'Ext.XTemplate',
    'Ext.ux.DateTimeField',
    'Ext.button.*',
    'Ext.Date.*'
]);

Ext.onReady(function() {
/*    var namespaceGrid = new App.namespaceGrid({
        selType: 'rowmodel',
        listeners: {
            select: function(RowModel, record, index, eOpts){
  	           var id = record.get('id');
 	           pod_ds.removeAll();
 	           pod_ds.load({params:{start:0, limit:20, namespaceId:id}});
            }
        }
    });*/
    
    var podGrid = new App.podGrid({
    	flex: 3.5,
        selType: 'rowmodel',
        listeners: {
            select: function(RowModel, record, index, eOpts){
   	           var id = record.get('id');
 	           container_ds.removeAll();
 	           container_ds.load({params:{start:0, limit:20, podId:id}});
 	           gpu_ds.loadData(record.get('gpus'));
            }
        }
    });
    
    var containerGrid = new App.containerGrid({
    	id: 'containerGrid',
    	flex: 3,
        selType: 'rowmodel',
        listeners: {
            select: function(RowModel, record, index, eOpts){
	           var id = record.get('id');
 	           process_ds.removeAll();
 	           process_ds.load({params:{start:0, limit:20, containerId:id}});
 	           gpu_ds.loadData(record.get('gpus'));
            }
        }
    });
    
    var processGrid = new App.processGrid({
    	flex: 3.5,
        selType: 'rowmodel',
        listeners: {
            select: function(RowModel, record, index, eOpts){
            	metric_ds.proxy.extraParams.processId = record.get('id');
				//metric_ds.removeAll();
				metric_ds.reload({page: 1});
				gpu_ds.loadData(record.get('gpus'));
            }
        }
    });
    
    var metricGrid = new App.metricGrid({
    	flex: 3,
    	itemId: 'metricGrid',
        selType: 'rowmodel'/*,
        listeners: {
            select: function(RowModel, record, index, eOpts){
  	            var gpuid = record.get('gpu.id');
 	            gpu_ds.load({params:{start:0, limit:20, gpuId:gpuid}});
            }
        },
        tbar:  [{
            xtype: 'button',
            text:'Chart',
            width:50,
            handler: function() {
            	showMetricChart();
            }
        }]*/
    });

	metric_ds.on('load', function(store, records, options ) {
		var record = gpuGrid.getSelectedRecord();
		if (!record) return;

    	var records2 = [];
    	store.each(function(r) {
    	    if (r.get('gpu.id') == record.get('id')) {
    	        records2.push(r);
    	    }
    	}, this);

    	store.loadData(records2);
    	if (records2.length)
    		metric_chart_win.show();
    	else
    		metric_chart_win.hide();
	});

    var gpuGrid = new App.gpuGrid({
        selType: 'rowmodel',
        listeners: {
            select: function(RowModel, record, index, eOpts){
            	//alert(record.get('id'));
            	//metric_ds.filter ('gpuId', record.get('id'));

            	metric_ds.reload();
            }
        },
        getSelectedRecord: function() {
            var records = this.getSelectionModel().getSelection(),
                record;

            if(records.length) {
                // get first record from selection
                record = records[0];

                // find selection record in store
                record = this.getStore().getById(record.getId());

                if(record) return record;
            }

            return false;
        }
    });

    var cw;

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    function closeRegion (e, target, header, tool) {
        var panel = header.ownerCt;
        newRegions.unshift(panel.initialConfig);
        viewport.remove(panel);
    }

    var newRegions = [{
            region: 'north',
            title: 'North 2',
            height: 100,
            collapsible: true,
            weight: -120
        }, {
            region: 'east',
            title: 'East 2',
            width: 100,
            collapsible: true,
            weight: -110
        }, {
            region: 'west',
            title: 'West 2',
            width: 100,
            collapsible: true,
            weight: -110
        }];

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [{
            region: 'north',
            //collapsible: true,
            split: true,
            height: 120,
            minSize: 30,
            maxSize: 400,
            layout:'fit',
            items: [namespacesDataViewPanel]
            //html: 'north'
        },{
            region: 'west',
            collapsible: true,
            //layout: 'absolute',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            split: true,
            width: '18%',
            minWidth: 100,
            minHeight: 140,
            items: [podGrid, containerGrid, processGrid]
        },{
            region: 'center',
            minHeight: 80,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            split: true,
            items: [metricGrid, metric_chart_win]
        },{
            region: 'east',
            collapsible: true,
            floatable: true,
            split: true,
            width: 180,
            minWidth: 120,
            minHeight: 140,
            layout: 'fit',
            items: [gpuGrid]
        }]
    });
});
