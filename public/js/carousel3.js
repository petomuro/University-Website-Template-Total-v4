COMPONENT(
  "carousel3",
  "selector:figure;mobileCount:1;tabletCount:2;count:3;margin:10;snapping:true;animate:5000;delay:2000;marginheight:0;duration:300;durationsnap:200;offsetwidth:0;scrolldivider:3",
  function (self, config, cls) {
    var cls2 = "." + cls;
    var width = 0;
    var margin = 0;
    var count = 0;
    var index = 0;
    var increment = 1;
    var skip = false;
    var move = false;
    var anim;
    var container;
    var old;
    var drag = {};
    var ready = false;
    var treset;

    self.readonly();

    self.destroy = function () {
      if (anim) {
        clearTimeout(anim);
        anim = null;
      }
    };

    self.refresh = function () {
      setTimeout(self.resizeforce, 50);
      setTimeout(self.resizeforce, 500);
      setTimeout(self.resizeforce, 2000);
      container = self.find(cls2 + "-container");
    };

    self.make = function () {
      self.aclass(cls + " invisible");
      self.element.wrapInner(
        '<div class="{0}-container"><div class="{0}-body"></div></div>'.format(
          cls
        )
      );
      self.on("resize2", self.resize);
      self.refresh();

      drag.tmove = function () {
        if (anim) {
          clearTimeout(anim);
          anim = null;
        }
        container.off("touchmove", drag.tmove);
      };

      config.snapping &&
        container
          .on("scroll", function () {
            !skip && setTimeout2(self.ID, self.snap, 300);
          })
          .on("touchmove", drag.tmove);

      drag.mmove = function (e) {
        var offset = (drag.x - e.pageX) / 2;
        var diff = width || (self.width() / config.scrolldivider) >> 0;

        if (Math.abs(offset) > 30) {
          var plus =
            (config.snapping ? (diff / 100) * 80 : diff) + config.margin;
          if (offset > 0) offset = plus;
          else offset = -plus;

          container
            .stop()
            .animate(
              { scrollLeft: container[0].scrollLeft + offset },
              config.duration
            );
          drag.mup();
        }
      };

      drag.mup = function () {
        self.element.off("mouseup", drag.mup).off("mousemove", drag.mmove);
        if (anim) {
          clearTimeout(anim);
          anim = null;
          container.on("touchmove", drag.tmove);
        }
      };

      self.element.on("mousedown", function (e) {
        drag.x = e.pageX;
        self.element.on("mousemove", drag.mmove).on("mouseup", drag.mup);
        e.preventDefault();
      });

      if (config.animate) anim = setTimeout(self.animate, config.animate);

      self.event("resize + resize2", self.resize);
    };

    var reset = function () {
      skip = false;
      anim = null;
      treset = null;
    };

    self.move = function (type, offset) {
      var x = container[0].scrollLeft;
      var diff = width || offset || (self.width() / config.scrolldivider) >> 0;
      var w = type === "left" || type === "next" ? diff : -diff;
      container
        .stop()
        .animate(
          { scrollLeft: x + w },
          config.durationsnap,
          config.snapping ? self.snap : NOOP
        );
    };

    self.animate = function () {
      if (!count || move) return;

      index += increment;

      if (index === count - 1) increment = -1;
      else if (index === 0) increment = 1;

      skip = true;
      anim = null;

      if (!NOTFOCUSED())
        container.animate(
          { scrollLeft: index * (width + config.margin) },
          config.durationsnap
        );

      treset && clearTimeout(treset);
      treset = setTimeout(reset, 400);
      anim = setTimeout(self.animate, config.delay);
    };

    var reset2 = function () {
      skip = false;
      treset = null;
    };

    self.snap = function () {
      var diff = width || (self.width / config.scrolldivider) >> 0;
      var x = container[0].scrollLeft;
      var off = Math.round(x / (diff + config.margin));
      skip = true;
      move = true;

      var pos = off * (diff + margin);
      var arr = self.find(config.selector);
      var sum = 0;

      for (var dom of arr)
        sum += +dom.getAttribute("data-width") + config.margin;

      container.stop().animate({ scrollLeft: pos }, config.durationsnap);
      treset && clearTimeout(treset);
      treset = setTimeout(reset2, 400);
    };

    self.focus = function (id) {
      var arr = self.find(config.selector);
      var sum = 0;
      var is = false;
      for (var dom of arr) {
        if (ATTRD(dom) === id) {
          is = true;
          break;
        }
        sum += +dom.getAttribute("data-width") + config.margin;
      }

      if (!is) return;

      var diff = sum;
      var w = self.width() - diff;
      container
        .stop()
        .animate(
          { scrollLeft: w },
          config.durationsnap,
          config.snapping ? self.snap : NOOP
        );
    };

    self.resize = function () {
      setTimeout2(self.ID + "resize", self.resizeforce, 200);
    };

    self.resizeforce = function () {
      if (!self.element) return;

      var w = self.element.width();
      if (!w) {
        self.element && setTimeout(self.resize, 100);
        return;
      }

      var sum = 0;

      if ($(window).width() < 768) {
        width = config.mobileCount ? w / config.mobileCount : 0;
        margin = config.mobileCount ? config.margin / config.mobileCount : 0;
      } else if ($(window).width() < 992 && $(window).width() >= 768) {
        width = config.tabletCount ? w / config.tabletCount : 0;
        margin = config.tabletCount ? config.margin / config.tabletCount : 0;
      } else {
        width = config.count ? w / config.count : 0;
        margin = config.count ? config.margin / config.count : 0;
      }

      count = 0;

      var arr = self.find(config.selector);
      var height = config.parent
        ? self.parent(config.parent).height() - config.marginheight
        : 0;
      var countheight = !height;
      var css = {};

      for (var dom of arr) {
        var el = $(dom);

        if (countheight) height = Math.max(el.innerHeight(), height);

        var w = width || el.width();

        sum += w + config.margin;
        if ($(window).width() < 768) {
          if (config.mobileCount) css.width = w - (config.margin - margin);
        } else if ($(window).width() < 992 && $(window).width() >= 768) {
          if (config.tabletCount) css.width = w - (config.margin - margin);
        } else {
          if (config.count) css.width = w - (config.margin - margin);
        }

        css["margin-right"] = config.margin;

        if (!countheight) css.height = height;

        el.attrd("width", w);
        el.css(css);
        count++;
      }

      var k = sum + "x" + height;

      if (old === k) return;

      old = k;
      container.css("height", height + 40);
      self.css("height", (height >> 0) + 2);
      self.find(cls2 + "-body").css("width", sum + config.offsetwidth);

      if (!ready) {
        self.rclass("invisible hidden");
        ready = true;
      }
    };

    self.setter = function () {
      self.refresh();
      container.stop().animate({ scrollLeft: 0 }, config.duration);
    };
  }
);
