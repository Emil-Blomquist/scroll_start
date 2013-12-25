$(window).on('mousewheel', function (event)
{
  event.preventDefault();


  var deltaY, timeStamp, result;

  deltaY = event.deltaY;
  timeStamp = event.timeStamp;

  // if console log/time here, the script will run slow!
  result = gatherData(timeStamp, deltaY);

  // if (result)
  // {
    // console.log(result)
  // }

});