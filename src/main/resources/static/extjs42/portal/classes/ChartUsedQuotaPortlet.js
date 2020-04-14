var chartusedquota_ds = Ext.create('Ext.data.JsonStore', {
                    fields: [
                    	{name: 'rowId', type: 'int', mapping:'rowId'},
            		    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
            		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
            		    {name: 'limitsMemory', mapping:'limitsMemory'},
            		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
            		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
            		    {name: 'requestsMemory', mapping:'requestsMemory'},
            		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
            		    {name: 'time', type: 'time', mapping:'time'}
            		    ]
                });

var gridStore = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'limits', 'requests']
});

var quotagrid = Ext.create('Ext.grid.Panel', {
    store: gridStore,
    height: 100,
    width: 200,
    columns: [
        {
            text   : 'name',
            dataIndex: 'name'
        },
        {
            text   : 'limits',
            dataIndex: 'limits'
        },
        {
            text   : 'requests',
            dataIndex: 'requests'
        }
    ]
});

Ext.define('Ext.app.ChartUsedQuotaPortlet', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.chartusedquotaportlet',

    requires: [
        'Ext.data.JsonStore',
        'Ext.chart.theme.Base',
        'Ext.chart.series.Series',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric'
    ],

    initComponent: function(){

        Ext.apply(this, {
            layout: 'fit',
            height: 300,
            items: {
                xtype: 'chart',
                animate: false,
                shadow: false,
                store: chartusedquota_ds,
                legend: {
                    position: 'right'
                },
                axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['requestsCpu'],
                    title: 'requests.cpu',
                    label: {
                        font: '11px Arial'
                    },
                    minimum: 0
                }, {
                    type: 'Numeric',
                    position: 'right',
                    grid: false,
                    fields: ['requestsNvidiaComGpu'],
                    title: 'requests.gpu',
                    label: {
                            font: '11px Arial'
                        }
                }, {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['requestsMemory'],
                    title: 'requests.cpu.memory',
                    label: {
                        font: '11px Arial'
                    },
                    minimum: 0
                }, {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['time'],
                    title: 'Time(ms)'
                }],
                series: [{
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: true,
                    smooth: true,
                    fill: true,
                    axis: 'left',
                    xField: 'time',
                    yField: 'requestsCpu',
                    style: {
                        'stroke-width': 1,
                        stroke: 'rgb(148, 174, 10)'

                    },  
                    tips: {
                        trackMouse: true,
                        width: 200,
                        height: 20,
                        layout: 'fit',
                        renderer: function(klass, item) {  
                            var storeItem = item.storeItem;

                            this.setTitle(new Date(storeItem.get('time')*1000));
                            Ext.ComponentQuery.query('#namespaceUsedQuotaGrid')[0].getSelectionModel().select(storeItem.get('rowId'));
                        }
                    }
                }, {
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: true,
                    smooth: true,
                    fill: true,
                    fillOpacity: 0.5,
                    axis: 'right',
                    xField: 'time',
                    yField: 'requestsNvidiaComGpu',
                    style: {
                        'stroke-width': 1,
                         stroke: 'rgb(17, 95, 166)'

                    },  
                    tips: {
                        trackMouse: true,
                        width: 200,
                        height: 20,
                        layout: 'fit',
                        /*items: {
                            xtype: 'container',
                            layout: 'fit',
                            items: [quotagrid]
                        },*/
                        renderer: function(klass, item) {  
                            var storeItem = item.storeItem;
                            /*    data = [{
                                    name: 'Cpu',
                                    limits: storeItem.get('limitsCpu'),
                                    requests: storeItem.get('requestsCpu')
                                }, {
                                    name: 'Memory',
                                    limits: storeItem.get('limitsMemory'),
                                    requests: storeItem.get('requestsMemory')
                                }, {
                                    name: 'GPU',
                                    limits: storeItem.get('requestsNvidiaComGpu'),
                                    requests: storeItem.get('requestsNvidiaComGpu')
                                }];
							*/
                            this.setTitle(new Date(storeItem.get('time')*1000));
                            //gridStore.loadData(data);
                            //quotagrid.setSize(200, 100);
                            Ext.ComponentQuery.query('#namespaceUsedQuotaGrid')[0].getSelectionModel().select(storeItem.get('rowId'));
                        }
                    }
                },{
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: true,
                    smooth: true,
                    fill: true,
                    fillOpacity: 0.5,
                    axis: 'left',
                    xField: 'time',
                    yField: 'requestsMemory',
                    style: {
                        'stroke-width': 1,
                         stroke: 'rgb(17, 95, 166)'
                    },  
                    tips: {
                        trackMouse: true,
                        width: 200,
                        height: 20,
                        layout: 'fit',
                        renderer: function(klass, item) {  
                            var storeItem = item.storeItem;

                            this.setTitle(new Date(storeItem.get('time')*1000));
                            Ext.ComponentQuery.query('#namespaceUsedQuotaGrid')[0].getSelectionModel().select(storeItem.get('rowId'));
                        }
                    }
                }]
            }
        });

        this.callParent(arguments);
    }
});