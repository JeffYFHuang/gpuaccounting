Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

    var chart_gpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
            style: 'background:#fff',
            animate: false,
            theme: 'Category1',
            store: metric_ds,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['cpu.percent', 'utilization.gpu'],
                title: '%',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['queryTime'],
                title: 'Time(utilization.gpu)'
            }],
            series: [/*{
                type: 'line',
                axis: 'left',
                smooth: true,
                fill: true,
                fillOpacity: 0.5,
                xField: 'queryTime',
                yField: 'cpu.percent'
            },*/ {
                type: 'line',
                axis: 'left',
                showMarkers: false,
                smooth: true,
                fill: true,
                fillOpacity: 0.5,
                xField: 'queryTime',
                yField: 'utilization.gpu'
            }]
        });
    
    var chart_mem_gpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
        style: 'background:#fff',
        animate: false,
        theme: 'Category2',
        store: metric_ds,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['gpu.memory.usage'],
            title: 'Mb',
            grid: true
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['queryTime'],
            title: 'Time(gpu.memory.usage)'
        }],
        series: [{
            type: 'line',
            axis: 'left',
            showMarkers: false,
            smooth: true,
            fill: true,
            fillOpacity: 0.5,
            xField: 'queryTime',
            yField: 'gpu.memory.usage'
        }]
    });
 
    var chart_cpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
            style: 'background:#fff',
            animate: false,
            theme: 'Category1',
            store: metric_ds,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['cpu.percent'],
                title: '%',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['queryTime'],
                title: 'Time(cpu.percent)'
            }],
            series: [{
                type: 'line',
                axis: 'left',
                showMarkers: false,
                smooth: true,
                fill: true,
                fillOpacity: 0.5,
                xField: 'queryTime',
                yField: 'cpu.percent'
            }]
        });
    
    var chart_mem_cpu = Ext.create('Ext.chart.Chart', {
    	flex:5,
        style: 'background:#fff',
        animate: false,
        theme: 'Category2',
        store: metric_ds,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['cpu.memory.usage'],
            title: 'Bytes',
            grid: true
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['queryTime'],
            title: 'Time(cpu.memory.usage)'
        }],
        series: [{
            type: 'line',
            axis: 'left',
            showMarkers: false,
            smooth: true,
            fill: true,
            fillOpacity: 0.5,
            xField: 'queryTime',
            yField: 'cpu.memory.usage'
        }]
    });
 
    var gpu_win = Ext.create('Ext.Panel', {
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

    var cpu_win = Ext.create('Ext.Panel', {
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
        items: [chart_cpu, chart_mem_cpu]
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
            type: 'hbox',
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
        items: [gpu_win, cpu_win]
    });

    
    metric_chart_win.hide();