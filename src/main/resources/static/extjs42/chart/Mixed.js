Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

    var chart_gpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
            style: 'background:#fff',
            animate: false,
            theme: 'Category1',
            store: metric_ds,
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'right',
                fields: ['cpu.percent'],
                title: '%(cpu)',
                grid: false
            }, {
                type: 'Numeric',
                position: 'left',
                fields: ['utilization.gpu'],
                title: '%(gpu)',
                grid: false
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['queryTime'],
                title: 'Time'
            }],
            series: [{
                type: 'line',
                axis: 'right',
                smooth: true,
                fill: true,
                fillOpacity: 0.5,
                xField: 'queryTime',
                yField: 'cpu.percent',  
                tips: {
                    trackMouse: true,
                    width: 160,
                    height: 20,
                    layout: 'fit',
                    renderer: function(klass, item) {  
                        var storeItem = item.storeItem;

                        this.setTitle(storeItem.get('queryTime'));
                        var rowId = Ext.ComponentQuery.query('#metricGrid')[0].getStore().indexOf(storeItem);
                        Ext.ComponentQuery.query('#metricGrid')[0].getSelectionModel().select(rowId);
                    }
                }
            }, {
                type: 'line',
                axis: 'left',
                showMarkers: true,
                smooth: true,
                fill: true,
                fillOpacity: 0.5,
                xField: 'queryTime',
                yField: 'utilization.gpu',
                tips: {
                    trackMouse: true,
                    width: 160,
                    height: 20,
                    layout: 'fit',
                    renderer: function(klass, item) {  
                        var storeItem = item.storeItem;

                        this.setTitle(storeItem.get('queryTime'));
                        var rowId = Ext.ComponentQuery.query('#metricGrid')[0].getStore().indexOf(storeItem);
                        Ext.ComponentQuery.query('#metricGrid')[0].getSelectionModel().select(rowId);
                    }
                }
            }]
        });
    
    var chart_mem_gpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
        style: 'background:#fff',
        animate: false,
        theme: 'Category2',
        store: metric_ds,
        legend: {
            position: 'right'
        },
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['gpu.memory.usage'],
            title: 'Mb(gpu)',
            grid: false
        }, {
            type: 'Numeric',
            position: 'right',
            fields: ['cpu.memory.usage'],
            title: 'Mb(cpu)',
            grid: false
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['queryTime'],
            title: 'Time'
        }],
        series: [{
            type: 'line',
            axis: 'left',
            showMarkers: true,
            smooth: true,
            fill: true,
            fillOpacity: 0.5,
            xField: 'queryTime',
            yField: 'gpu.memory.usage',
            tips: {
                trackMouse: true,
                width: 160,
                height: 20,
                layout: 'fit',
                renderer: function(klass, item) {  
                    var storeItem = item.storeItem;

                    this.setTitle(storeItem.get('queryTime'));
                    var rowId = Ext.ComponentQuery.query('#metricGrid')[0].getStore().indexOf(storeItem);
                    Ext.ComponentQuery.query('#metricGrid')[0].getSelectionModel().select(rowId);
                }
            }
        }, {
            type: 'line',
            axis: 'right',
            showMarkers: true,
            smooth: true,
            fill: true,
            fillOpacity: 0.5,
            xField: 'queryTime',
            yField: 'cpu.memory.usage',
            tips: {
                trackMouse: true,
                width: 160,
                height: 20,
                layout: 'fit',
                renderer: function(klass, item) {  
                    var storeItem = item.storeItem;

                    this.setTitle(storeItem.get('queryTime'));
                    var rowId = Ext.ComponentQuery.query('#metricGrid')[0].getStore().indexOf(storeItem);
                    Ext.ComponentQuery.query('#metricGrid')[0].getSelectionModel().select(rowId);
                }
            }
        }]
    });

    var metric_chart_win = Ext.create('Ext.Panel', {
    	flex: 5,
    	//floating: true,
        //centered: true,
        //modal: true,
        //width: 800,
        //height: 600,
        //minHeight: 400,
        //minWidth: 550,
        hidden: false,
        maximizable: true,
        //title: 'Mixed Charts',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }/*,
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
        }]*/,
        items: [chart_gpu, chart_mem_gpu]
    });

    
    metric_chart_win.hide();