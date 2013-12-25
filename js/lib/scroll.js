var gatherData = function (timeStamp, dl)
{
  var i, maxPause, dataPerAnalysis, results, direction;

  maxPause = 100;
  dataPerAnalysis = 12;

  // initioate scrolling
  if (gatherData.t0 === 0)
  {
    gatherData.t0 = timeStamp;

    // temp
    $('svg').empty();
  }

  // add data to storage
  gatherData.t.push(timeStamp - gatherData.t0);
  gatherData.dl.push(dl);

  direction = 0;

  // data gathering complete
  if (gatherData.t.length === dataPerAnalysis)
  {
    // analyze data
    results = analyzeData(gatherData.t, gatherData.dl);

    for (i = 0; i < results.length; i++)
    {

      if (results[i] && gatherData.current === 0)
      {
        if (results[i] > 0)
        {
          // scroll up
          direction = 1;
        }
        else
        {
          // scroll down
          direction = -1;
        }

        gatherData.current = 1;
      }
      else if (results[i] === 0)
      {
        gatherData.current = 0;
      }


    }

    // reset for next run
    gatherData.t = [];
    gatherData.dl = [];

  }

  // reset timer
  clearTimeout(gatherData.timer);
  gatherData.timer = setTimeout(function ()
  {
    // new scroll

    // reset data
    gatherData.t0 = 0;
    gatherData.t = [];
    gatherData.dl = [];
    gatherData.current = 0; // 1 = accel, -1 = retard
  }, maxPause);

  // return event;
  return direction;

}
gatherData.t0 = 0;
gatherData.t = [];
gatherData.dl = [];
gatherData.current = 0;
gatherData.timer = 0;

var analyzeData = function (t, dl)
{
  var i, maxDl, maxDli, minDl, minDli, minCoords, t1, t2, t3, dl1, dl2, dl2, lq, T, DL, results;

  minCoords = 3;

  // 1. find max, min
  // 2. make 3 intervals consisting of a minimum of 3 coordinates, maximum, minimum excluded
  // 3. least square all intervals

  // 1. 
  maxDl = dl[0];
  maxDli = 0;
  minDl = dl[0];
  minDli = 0;
  for (i = 0; i < dl.length; i++)
  {
    // max
    if (/*Math.abs'*/(dl[i]) > maxDl)
    {
      maxDl = /*Math.abs'*/(dl[i]);
      maxDli = i;
    }
    // min
    if (/*Math.abs'*/(dl[i]) < minDl)
    {
      minDl = /*Math.abs'*/(dl[i]);
      minDli = i; 
    }
  }


  // 2.
  T = [];
  DL = [];
  if (maxDli > minDli)
  {
    T[0] = t.slice(0, minDli);
    T[1] = t.slice(minDli + 1, maxDli);
    T[2] = t.slice(maxDli + 1);

    DL[0] = dl.slice(0, minDli);
    DL[1] = dl.slice(minDli + 1, maxDli);
    DL[2] = dl.slice(maxDli + 1);
  }
  else
  {
    T[0] = t.slice(0, maxDli);
    T[1] = t.slice(maxDli + 1, minDli);
    T[2] = t.slice(minDli + 1);

    DL[0] = dl.slice(0, maxDli);
    DL[1] = dl.slice(maxDli + 1, minDli);
    DL[2] = dl.slice(minDli + 1);
  }


  // 3.
  lq = [];
  results = [];
  lq[0] = lq[1] = lq[2] = false;

  for (i = 0; i < 3; i++)
  {
    if (T[i].length >= minCoords)
    {
      lq[i] = leastSquare(T[i], DL[i]);

      if (lq[i])
      {
        results = results.concat(conclusion(T[i][0], T[i][T[i].length - 1], lq[i][0], lq[i][1]));
      }
    }
  }


  // 
  // Plots
  // 

  // points
  analyzeData.plotClass *= -1;
  plot(t, dl, 'c' + analyzeData.plotClass, 2);

  // max/ min 
  plot([t[maxDli]], [dl[maxDli]], 'max', 3);
  plot([t[minDli]], [dl[minDli]], 'min', 3);

  // least square plot
  for (i = 0; i < 3; i++)
  {
    if (lq[i])
    {
      line(T[i][0], T[i][T[i].length - 1], lq[i][0], lq[i][1], 'lq');
    }
  }


  return results;
}
analyzeData.plotClass = -1;


var conclusion = function (x1, x2, k, m)
{
  var y1, y2, e, kMin, posOrNeg;

  e = 5;
  kMin = 0.05;

  y1 = m + x1*k;
  y2 = m + x2*k;


  // 
  // positiv acceleration > 0
  // negativ acceleration < 0
  // retardaration = 0
  // 

  // osäkerhet
  if (Math.abs(y1) < e && Math.abs(y2) < e)
  {
    // console.log('osäkerhet i båda')
    // för att eliminera småfel?
    // osäkerhet i båda
    // om k är stort till belopp <=> byte av sida
    if (Math.abs(k) < kMin)
    {
      // Ingen nödvändig information
      // lämgst bort på en retardation
      return false;
    }

    if (y1*y2 > 0)
    {
      // y1 och y2 på samma sida
      // för litet utslag

      return false;
    }
    else
    {
      // y1 och y2 ligger på varsin sida
      // k talar om vilket håll det hela är påväg

      // kort linjarisering nära y = 0
      return [0, k];
    }

  }
  else if (Math.abs(y1) < e )
  {
    // osäker i y1
    posOrNeg = y2;
  }
  else if (Math.abs(y2) < e)
  {
    // osäker i y2
    posOrNeg = y1;
  }
  else
  {
    // ingen osäkerhet

    if (y1*y2 > 0)
    {
      // ligger på samma sida
      posOrNeg = y1;
    }
    else
    {
      // olika sida
      // k avslöjar som tidigare
      return [0, k];
    }
  }


  if (k > 0 && posOrNeg > 0)
  {
    // acceleration uppåt
    return k;
  }
  else if (k < 0 && posOrNeg < 0)
  {
    // acceleration uppåt
    return k;
  }
  else
  {
    // retardaration
    return 0;
  }



}


var leastSquare = function (t, dl)
{
  var a, b, c, d, n, i, k, m;

  a = b = c = d = 0;
  for (i = 0; i < t.length; i++)
  {
    a += t[i];
    b += t[i]*t[i];
    c += dl[i];
    d += t[i]*dl[i];
  }
  n = t.length;

  k = (n*d - a*c)/(n*b - a*a);
  m = (b*c - a*d)/(n*b - a*a);

  return [k, m];
}