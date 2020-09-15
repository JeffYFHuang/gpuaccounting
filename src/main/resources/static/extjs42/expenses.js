    	/*
    	this.expenseId = expenseId;
    	this.cpuHours = 0;
    	this.cpuUsedHours = 0;
    	this.gpuHours = 0;
    	this.gpuMUsedHours = 0;
    	this.cpuUsedHours = 0;
    	this.memoryHours = 0;
    	this.memoryUsedHours = 0;*/
     Ext.define('Ext.form.field.Month', {
        extend: 'Ext.form.field.Date',
        alias: 'widget.monthfield',
        requires: ['Ext.picker.Month'],
        alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
        selectMonth: null,
        createPicker: function() {
            var me = this,
                format = Ext.String.format;
            return Ext.create('Ext.picker.Month', {
                pickerField: me,
                ownerCt: me.ownerCt,
                renderTo: document.body,
                floating: true,
                hidden: true,
                focusOnShow: true,
                minDate: me.minValue,
                maxDate: me.maxValue,
                disabledDatesRE: me.disabledDatesRE,
                disabledDatesText: me.disabledDatesText,
                disabledDays: me.disabledDays,
                disabledDaysText: me.disabledDaysText,
                format: me.format,
                showToday: me.showToday,
                startDay: me.startDay,
                minText: format(me.minText, me.formatDate(me.minValue)),
                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                listeners: {
                    select: {
                        scope: me,
                        fn: me.onSelect
                    },
                    monthdblclick: {
                        scope: me,
                        fn: me.onOKClick
                    },
                    yeardblclick: {
                        scope: me,
                        fn: me.onOKClick
                    },
                    OkClick: {
                        scope: me,
                        fn: me.onOKClick
                    },
                    CancelClick: {
                        scope: me,
                        fn: me.onCancelClick
                    }
                },
                keyNavConfig: {
                    esc: function() {
                        me.collapse();
                    }
                }
            });
        },
        onCancelClick: function() {
            var me = this;
            me.selectMonth = null;
            me.collapse();
        },
        onOKClick: function() {
            var me = this;
            if (me.selectMonth) {
                me.setValue(me.selectMonth);
                me.fireEvent('select', me, me.selectMonth);
            }
            me.collapse();
        },
        onSelect: function(m, d) {
            var me = this;
            me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
            expense_ds.proxy.extraParams.year = d[1];
            expense_ds.proxy.extraParams.month = d[0];

            expense_ds.load();
        }
    });
 
	Ext.define('Expense', {
	    extend: 'Ext.data.Model',
	    fields: [
		    {name: 'namespaceId', type: 'int', mapping:'expenseId.namespaceId'},
		    {name: 'year', mapping:'expenseId.year'},
		    {name: 'month', mapping:'expenseId.month'},
		    {name: 'cpuHours', mapping:'cpuHours'},
		    {name: 'gpuHours', mapping:'gpuHours'},
		    {name: 'memoryHours', mapping:'memoryHours'},
		    {name: 'cpuUsedHours', mapping:'cpuUsedHours'},
		    {name: 'gpuUsedHours', mapping:'gpuUsedHours'},
		    {name: 'gpuMUsedHours', mapping:'gpuMUsedHours'},
		    {name: 'memoryUsedHours', mapping:'memoryUsedHours'}
		    ]
	});

	var expense_ds = new Ext.data.Store({
		  autoLoad: true,
		  model:'Expense',
		  proxy: {
		        type: 'ajax',
		        url:'/expenses',
		        reader: {
		            type: 'json',
		      	    totalProperty: 'totalElements',
		    	    successProperty: 'success',
		            root: 'data'
		        }
		  }
		  //remoteSort: true
	}); 


	var monthPicker = new Ext.form.field.Month({
			        format: 'F, Y',
			        fieldLabel: 'Month'
			    });
    monthPicker.selectMonth = new Date();

    Ext.define('App.expense', {
        extend: 'Ext.grid.Panel',
        layout: 'fit',
        height: 200,
        // This will associate an string representation of a class
        // (called an xtype) with the Component Manager
        // It allows you to support lazy instantiation of your components
        alias: 'widget.expense',
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
            	{text: "namespaceId", sortable: true, flex: 0.1, dataIndex: 'namespaceId'},
                {text: "year", sortable: true, flex: 0.1, dataIndex: 'year'},
                {text: "month", sortable: true, flex: 0.1, dataIndex: 'month'},
                {text: "cpuHours", sortable: true, flex: 0.1, dataIndex: 'cpuHours'},
                {text: "gpuHours", sortable: true, flex: 0.1, dataIndex: 'gpuHours'},
                {text: "memoryHours", sortable: true, flex: 0.1, dataIndex: 'memoryHours'}
            ];
            // Note the use of a storeId, this will register thisStore
            // with the StoreManager and allow us to retrieve it very easily.
            this.store = expense_ds;
            // finally call the superclasses implementation
            this.bbar = new Ext.PagingToolbar({
                store: expense_ds,
                displayInfo: true

                //plugins: new Ext.ux.ProgressBarPager()
            });
 
            this.callParent(arguments);
        }, tbar: {
        	xtype: 'toolbar',
        	items: [
        		monthPicker
        	]
        }
    });
