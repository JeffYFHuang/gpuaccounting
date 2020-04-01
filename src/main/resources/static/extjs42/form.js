    Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },

        daterangeText: 'Start date must be less than end date',

        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },

        passwordText: 'Passwords do not match'
    });
    
    Ext.tip.QuickTipManager.init();

    /*
     * ================  Date Range  =======================
     */

    function toTimestamp(dateValue, timeValue){
    	if (dateValue != null && timeValue != null) {
    		var datum = Date.parse(dateValue + " " + timeValue + " GMT+8");
    		return new Date(datum);
        }

 	   	return null;
 	}

    function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
    }

    function toLocaleString(date) {
    	return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.' + (date.getMilliseconds()).toFixed(6).slice(2, 8);
    }

    //03/30/202011:11:21CST
    function toCSTString(date) {
    	return pad(date.getMonth() + 1) +  
    	'/' + pad(date.getDate()) + 
    	'/' + date.getFullYear() +
        '' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        'CST';
    }

    function onButtonClick(btn){
        values = formPanel.getForm().getValues();
        startDt = toTimestamp(values['startdt'], values['startt']);
        endDt = toTimestamp(values['enddt'], values['endt']);
        if (startDt == null || endDt == null) {
        	alert('Please provide start date time or end date time.');
        	return;
        }

        //alert(startDt + " " + endDt);
        if (startDt >= endDt) {
        	alert("End date time should be greater than start date time!");
        	return;
        }

    	pod_ds.proxy.extraParams.startDateTime = toCSTString(startDt);
    	pod_ds.proxy.extraParams.endDateTime = toCSTString(endDt);

    	container_ds.proxy.extraParams.startDateTime = toCSTString(startDt);
    	container_ds.proxy.extraParams.endDateTime = toCSTString(endDt);

    	process_ds.proxy.extraParams.startDateTime = toLocaleString(startDt);
    	process_ds.proxy.extraParams.endDateTime = toLocaleString(endDt);
    	
    	metric_ds.proxy.extraParams.startDateTime = toLocaleString(startDt);
    	metric_ds.proxy.extraParams.endDateTime = toLocaleString(endDt);

    	pod_ds.load();
    	container_ds.load();
    	process_ds.load();
    	metric_ds.load();
    	/*{
			startDateTime: toLocaleString(startDt),//.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
			endDateTime: toLocaleString(endDt)
    	};*/
    }

    var formPanel = Ext.create('Ext.form.Panel', {
        frame: true,
        //bodyPadding: '5 5 0',
        width: '100%',
        fieldDefaults: {
            labelWidth: 80,
            msgTarget: 'side',
            autoFitErrors: false
        },
        defaults: {
            width: 200
        },
        layout: {
        	type: 'hbox',
        	align: 'center',
        	pack: 'center'
        },
        defaultType: 'datefield',
        items: [{
            fieldLabel: 'Start Date',
            name: 'startdt',
            itemId: 'startdt',
            vtype: 'daterange',
            endDateField: 'enddt' // id of the end date field
        }, {
        	xtype: 'timefield',
            reference: 'timeField',
            name: 'startt',
            format: 'H:i',
            value: '00:00',
            maxValue: '24:00',
            increment: 15,
            width: 80
        }, {
            fieldLabel: 'End Date',
            name: 'enddt',
            itemId: 'enddt',
            vtype: 'daterange',
            startDateField: 'startdt' // id of the start date field
        }, {
        	xtype: 'timefield',
            reference: 'timeField',
            name: 'endt',
            format: 'H:i',
            value: '00:00',
            maxValue: '24:00',
            increment: 15,
            width: 80
        }, {
        	xtype: 'button',
        	text: 'Apply',
            iconAlign: 'left',
            width: 50,
            handler: onButtonClick
        }]
    });