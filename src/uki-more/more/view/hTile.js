include('../view.js');

uki.view.declare('uki.more.view.HTile', uki.view.VFlow, function(Base) {

    function getTileGrid(childViews, maxWidth, isEqualTiles) {
        var ti = {totalHeight: 0, totalWidth: 0, childRects: []};

        ti.maxChildWidth = uki.reduce(0, childViews, function(max, e) {
             return (e.visible() && e.width() > max) ? e.width() : max
         });

         ti.maxChildHeight = uki.reduce(0, childViews, function(max, e) {
             return (e.visible() && e.height() > max) ? e.height() : max
         });

        // Now layout each item
        var x = 0, y = 0, rowHeight = 0;
        var view, rect;
        for (var i = 0; i < childViews.length; i++) {
            view = childViews[i];

            // skip invisible
            if (!view.visible()) {
                ti.childRects.push(view.x(), view.y(), view.width(), view.height());
                continue;
            }

            // check if need to start a new row
            if ((view.width() + x) > maxWidth && x > 0) {
                x = 0;
                y = y + (isEqualTiles ? ti.maxChildHeight : rowHeight);
                rowHeight = 0;
            }

            rect = new uki.geometry.Rect(x, y, view.width(), view.height());
            ti.childRects.push(rect);

            // check if we have achieved a new max width
            if ((x + rect.width) > ti.totalWidth) {
               ti.totalWidth = x + rect.width;
            }

            // check if we have gotten a new row height
            if (rect.height > rowHeight) {
               rowHeight = rect.height;
            }

            // move over a column
            x = x + (isEqualTiles ? ti.maxChildWidth : view.width());
        }

        ti.totalHeight = y + rowHeight;


        return ti;
    }

    this.isEqualTiles = uki.newProp('_isEqualTiles');

    this._setup = function() {
        Base._setup.call(this);
        this._isEqualTiles = true;
    };

    this.contentsSize = function() {
        var ti = getTileGrid(this._childViews, this.parent().width(), this._isEqualTiles);
        return new Size(ti.totalWidth, ti.totalHeight);
    };

    this._resizeChildViews = function(oldRect) {
        var ti = getTileGrid(this._childViews, this.parent().width(), this._isEqualTiles);
        var view;

        for (var i = 0, childViews = this.childViews(); i < childViews.length; i++) {
            view = childViews[i];

            view.parentResized(oldRect, this._rect);

            view.rect(ti.childRects[i]);
        }

        this.rect().width = ti.totalWidth;
        this.rect().height = ti.totalHeight;
    };

});
