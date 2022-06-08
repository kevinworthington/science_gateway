L.Control.GradientControl = L.Control.extend({
  onAdd: function(map) {
    var el = L.DomUtil.create('div');
    var canvas = document.createElement('canvas');
    canvas.id = 'gradient_bg';
    el.appendChild(canvas)
    canvas.setAttribute ( "class", "gradient" );
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0,0, 200,0);
    // Add three color stops
    
    gradient.addColorStop(0,colors[0]);
    gradient.addColorStop(.083,colors[1]);
    gradient.addColorStop(.175,colors[2]);
    gradient.addColorStop(.35,colors[3]);
    gradient.addColorStop(.525,colors[4]);
    gradient.addColorStop(1,colors[5]);

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 100);

    return el;
  },

  onRemove: function(map) {
    // Nothing to do here
  }
});

L.control.GradientControl = function(opts) {
  return new L.Control.GradientControl(opts);
}

