include('../view.js');

uki.view.declare('uki.more.view.HFlowWrap', uki.view.VFlow, function(Base) {

    function getTileGrid(childViews, maxWidth) {
        var ti = {totalHeight: 0, totalWidth: 0, childRects: []};

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
            if ((view.width() + x) > maxWidth) {
                x = 0;
                y = y + rowHeight;
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
            x = x + view.width();
        }

        ti.totalHeight = y + rowHeight;


        return ti;
    }

    this.contentsSize = function() {
        var ti = getTileGrid(this._childViews, this.parent().width());
        return new Size(ti.totalWidth, ti.totalHeight);
    };

    this._resizeChildViews = function(oldRect) {
        var ti = getTileGrid(this._childViews, this.parent().width());
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
