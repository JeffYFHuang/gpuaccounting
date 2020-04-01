var chartusedquota_ds = Ext.create('Ext.data.JsonStore', {
                    fields: [
                    	//{name: 'id', type: 'int', mapping:'id'},
            		    {name: 'namespaceId', type: 'int', mapping:'namespaceId'},
            		    {name: 'limitsCpu', type: 'int', mapping:'limitsCpu'},
            		    {name: 'limitsMemory', mapping:'limitsMemory'},
            		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
            		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
            		    {name: 'requestsMemory', mapping:'requestsMemory'},
            		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
            		    {name: 'time', type: 'datetime', mapping:'time'}
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
            height: 250,
            items: {
                xtype: 'chart',
                animate: false,
                shadow: false,
                //store: namespaceusedquota_ds,
                store: chartusedquota_ds,
                legend: {
                    position: 'bottom'
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
                }],
                series: [{
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: false,
                    smooth: true,
                    fill: true,
                    axis: 'left',
                    xField: 'time',
                    yField: 'requestsCpu',
                    style: {
                        'stroke-width': 1,
                        stroke: 'rgb(148, 174, 10)'

                    }
                }, {
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: false,
                    smooth: true,
                    fill: true,
                    fillOpacity: 0.5,
                    axis: 'right',
                    xField: 'time',
                    yField: 'requestsNvidiaComGpu',
                    style: {
                        'stroke-width': 1,
                         stroke: 'rgb(17, 95, 166)'

                    }
                },{
                    type: 'line',
                    lineWidth: 1,
                    showMarkers: false,
                    smooth: true,
                    fill: true,
                    fillOpacity: 0.5,
                    axis: 'left',
                    xField: 'time',
                    yField: 'requestsMemory',
                    style: {
                        'stroke-width': 1,
                         stroke: 'rgb(17, 95, 166)'
                    }
                }]
            }
        });

        this.callParent(arguments);
    }
});