'use strict'

class FormatToolbar {

    constructor(domNode
                , onChangedDrawMode=function (actionType, actionValue) {}
                , onZoomInOut=function (zoomIn) {}) {

        this.domNode = domNode;
        this.onChangedDrawMode = onChangedDrawMode;
        this.onZoomInOut = onZoomInOut;
        this.firstItem = null;
        this.lastItem = null;

        this.toolbarItems = [];
        this.drawItems = [];

        this.start = null;
        this.end = null;
        this.selected = null;
        this.currentZoomRate = 100;
    }

    init() {
        let i, items, toolbarItem;

        this.domNode.addEventListener('click', this.handleContainerClick.bind(this));
        items = this.domNode.querySelectorAll('.item');
        for (let item of items) {
            toolbarItem = new FormatToolbarItem(item, this, this.onChangedDrawMode);
            toolbarItem.init();

            if (i === 0) {
                this.firstItem = toolbarItem;
            }
            this.lastItem = toolbarItem;
            this.toolbarItems.push(toolbarItem);
        }

        let spinButtons = this.domNode.querySelectorAll('[role=spinbutton]');

        for (let button of spinButtons) {
            let spinButton = new SpinButton(button, this);
            spinButton.init();
        }
    }

    handleContainerClick() {
        if (event.target !== this.domNode) return;
        this.setFocusCurrentItem();
    }

    setFocusCurrentItem() {
        let item = this.domNode.querySelector('[tabindex="0"]');
        item.focus();
    }

    changeZoomRate (value) {
        if (this.currentZoomRate === value) {
            return;
        }
        if (this.currentZoomRate > value) {
            this.onZoomInOut(false);
        } else {
            this.onZoomInOut(true);
        }
        this.currentZoomRate = value;
    }

    redirectLink(toolbarItem) {
        window.open(toolbarItem.domNode.href, '_blank');
    }

    setDrawMode (toolbarItem) {
        for (let drawItem of this.drawItems) {
            drawItem.resetChecked();
        }
        toolbarItem.setChecked();
    }

    activateItem(toolbarItem) {
        switch (toolbarItem.buttonAction) {
            case 'draw-mode':
                this.setDrawMode(toolbarItem);
                break;
            case 'link':
                this.redirectLink(toolbarItem);
                break;
            default:
                break;
        }
    };

    /**
     * @description
     *  Focus on the specified item
     * @param item
     *  The item to focus on
     */
    setFocusItem (item) {

        for (let toolbarItem of this.toolbarItems) {
            toolbarItem.domNode.setAttribute('tabindex', '-1');
        }

        item.domNode.setAttribute('tabindex', '0');
        item.domNode.focus();
    }

    setFocusToNext(currentItem) {
        let index, newItem;

        if (currentItem === this.lastItem) {
            newItem = this.firstItem;
        } else {
            index = this.toolbarItems.indexOf(currentItem);
            newItem = this.toolbarItems[index + 1];
        }
        this.setFocusItem(newItem);
    }

    setFocusToPrevious (currentItem) {
        let index, newItem;

        if (currentItem === this.firstItem) {
            newItem = this.lastItem;
        } else {
            index = this.toolbarItems.indexOf(currentItem);
            newItem = this.toolbarItems[index - 1];
        }
        this.setFocusItem(newItem);
    }

    setFocusToFirst() {
        this.setFocusItem(this.firstItem);
    }

    setFocusToLast() {
        this.setFocusItem(this.lastItem);
    }

    hidePopupLabels() {
        let tps = this.domNode.querySelectorAll('button .popup-label');
        tps.forEach(function (tp) {
            tp.classList.remove('show');
        });
    }
}