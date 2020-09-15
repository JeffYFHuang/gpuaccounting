    /*
    @Column(name = "gpu_hours", columnDefinition = "float(4) default 0")
    private float gpuHours;
    @Column(name = "cpu_hours", columnDefinition = "float(4) default 0")
    private float cpuHours;
    @Column(name = "memory_hours", columnDefinition = "float(4) default 0")
    private float memoryHours;
    @Column(name = "gpu_used_hours", columnDefinition = "float(4) default 0")
    private float gpuUsedHours;
    @Column(name = "gpu_m_used_hours", columnDefinition = "float(4) default 0") //gpu memory used
    private float gpuMUsedHours;
    @Column(name = "cpu_used_hours", columnDefinition = "float(4) default 0")
    private float cpuUsedHours;
    @Column(name = "memory_used_hours", columnDefinition = "float(4) default 0")
    private float memoryUsedHours;
    @Column(name = "type", columnDefinition = "int(2) default 0")
    private Integer type;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "lastupdated", nullable = false)
    private Date lastupdated;
    */
   	Ext.define('Expense', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'namepsace_id', type: 'int', mapping:'namepsace_id'},
		    {name: 'year'},
		    {name: 'month'},
		    {name: 'gpuHours', mapping:'gpuHours'},
		    {name: 'gpuHours', mapping:'Hours'},
		    {name: 'limitsNvidiaComGpu', type: 'int', mapping:'limitsNvidiaComGpu'},
		    {name: 'requestsCpu', type: 'int', mapping:'requestsCpu'},
		    {name: 'requestsMemory', mapping:'requestsMemory'},
		    {name: 'requestsNvidiaComGpu', type: 'int', mapping:'requestsNvidiaComGpu'},
		    {name: 'pods', mapping:'pods'},
		    {name: 'namespaceusedresourcequotas', mapping:'namespaceusedresourcequotas'}
		    ]
	});

	var namespace_ds = new Ext.data.Store({
		  //autoLoad: true,
		  model:'Namespace',
		  proxy: {
		        type: 'ajax',
		        url:'/namespaces',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 
	
    var dataview = Ext.create('Ext.view.View', {
        deferInitialRefresh: false,
        store: namespace_ds,
        tpl  : Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="phone">',
                '<img width="30" height="30" src="./images/user0.png" />',
                '<strong>{name}</strong>',
                '</div>',
            '</tpl>'
        ),

        /*plugins : [
            Ext.create('Ext.ux.DataView.Animated', {
                duration  : 550,
                idProperty: 'id'
            })
        ],*/
        id: 'phones',

        itemSelector: 'div.phone',
        overItemCls : 'phone-hover',
        multiSelect : false,
        autoScroll  : true,
        listeners:{
         itemclick:function(v, record, item, index, e) {
   	           var id = record.get('id');
   	           pod_ds.removeAll();
   	           pod_ds.load({params:{start:0, limit:20, namespaceId:id}});
   	       }  
        }
    });

    var tb = Ext.create('Ext.toolbar.Toolbar');

    tb.add(formPanel);

    /*tb.add({
    	xtype: 'datefield',
        fieldLabel: 'End Date',
        name: 'enddt',
        itemId: 'enddt',
        vtype: 'daterange',
        startDateField: 'startdt' // id of the start date field
    });*/

    var namespacesDataViewPanel = new Ext.Panel({
        //title: 'namespaces',
        layout: 'fit',
        items : dataview,
        autoScroll  : true,
        bbar : tb
        //height: 615,
        //width : 800,
    });

    namespace_ds.load({params:{start:0, limit:20}});
//});