$('#picker1').timePicker(function(hour, minute) {
    console.debug('timepicker1 final value：%s, %s', hour, minute);
});

$('#picker2').timePicker(function(hour, minute) {
    console.debug('timepicker2 final value：%s, %s', hour, minute);
});
