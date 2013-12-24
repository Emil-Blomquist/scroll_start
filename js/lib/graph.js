
var draw_svg = function (shapes)
{
  var elem, attributes, svg;

  svg = $("svg");

  for (i in shapes)
  {
    attributes = shapes[i];

    var elem = document.createElementNS('http://www.w3.org/2000/svg', attributes.type);

    for (var j in attributes)
    {
      elem.setAttribute(j, attributes[j])
    }

    svg.append(elem);
  }
}

var plot = function (x, y, styleClass, r)
{
  var height = $('svg').height()/2;

  for (var i = 0; i < x.length; i++)
  {
    draw_svg([
      {
        type: 'circle',
        cx: x[i],
        cy: height - y[i],
        r: r,
        class: styleClass
      }
    ]);
  }
}

var line = function (x1, x2, k, m, styleClass)
{
  var height = $('svg').height()/2;

  draw_svg([
    {
      type: 'line',
      x1: x1,
      x2: x2,
      y1: height - (m + x1*k),
      y2: height - (m + x2*k),
      class: styleClass
    }
  ]);
}



































// var graph = function (t, dl, cssClass)
// {
//   var height, svg;

//   svg = $('svg');

//   height = svg.height();

//   // rita graf
//   draw_svg([
//     {
//       type: 'circle',
//       cx: t[0],
//       cy: height - dl[0],
//       r: 2,
//       'class': cssClass
//     }
//   ]);
//   for (var i = 0; i < t.length - 1; i++)
//   {
//     // draw
//     draw_svg([
//       {
//         type: 'line',
//         x1: t[i],
//         x2: t[i + 1],
//         y1: height - dl[i],
//         y2: height - dl[i + 1],
//         'class': cssClass
//       },
//       {
//         type: 'circle',
//         cx: t[i + 1],
//         cy: height - dl[i + 1],
//         r: 2,
//         'class': cssClass
//       }
//     ]);
//   }

//   // expand graph
//   if (svg.find(':last-child').offset().left > svg.width())
//   {
//     svg.width(svg.find(':last-child').offset().left)

//     $('.upper').scrollLeft(svg.find(':last-child').offset().left);
//   }
// }