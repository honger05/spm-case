$('#inner-content-div').slimScroll({
    width: '300px',
    height: '500px',
    size: '4px',
    position: 'right',
    color: '#08c',
    alwaysVisible: false,
    distance: '1px',
    railVisible: true,
    railColor: '#222',
    railOpacity: 0.3,
    wheelStep: 10,
    allowPageScroll: true,
    disableFadeOut: true
}).bind('slimscroll', function(e, pos){
    console.log("Reached " + pos);
});