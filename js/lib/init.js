$('.scroller').on('mousewheel', function (event)
{
  var deltaY, timeStamp;

  deltaY = event.deltaY;
  timeStamp = event.timeStamp;

  console.log(gatherData(timeStamp, deltaY));
});