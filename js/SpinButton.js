'use strict';

export default class SpinButton {

    MIN = 50;
    MAX = 400;
    DEFAULT = 100;
    INC_VAL = 10;
    BIG_INC = 50;

    constructor(domNode, toolbar) {

        this.domNode = domNode;
        this.toolbar = toolbar;

        this.valueDomNode = domNode.querySelector('.value');
        this.increaseDomNode = domNode.querySelector('.increase');
        this.decreaseDomNode = domNode.querySelector('.decrease');

        this.valueMin = this.MIN;
        this.valueMax = this.MAX;
        this.valueNow = this.DEFAULT;
        this.valueText = this.valueNow + ' %';

        this.keyCode = Object.freeze({
            UP: 38,
            DOWN: 40,
            PAGEUP: 33,
            PAGEDOWN: 34,
            END: 35,
            HOME: 36,
        });
    }

    init() {
        if (this.domNode.getAttribute('aria-valuemin')) {
            this.valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));
        }

        if (this.domNode.getAttribute('aria-valuemax')) {
            this.valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
        }

        if (this.domNode.getAttribute('aria-valuenow')) {
            this.valueNow = parseInt(this.domNode.getAttribute('aria-valuenow'));
        }

        this.setValue(this.valueNow);

        this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.increaseDomNode.addEventListener(
            'click',
            this.handleIncreaseClick.bind(this)
        );
        this.decreaseDomNode.addEventListener(
            'click',
            this.handleDecreaseClick.bind(this)
        );
    };

    setValue (value) {
        if (value > this.valueMax) {
            value = this.valueMax;
        }

        if (value < this.valueMin) {
            value = this.valueMin;
        }

        this.valueNow = value;
        this.valueText = value + ' %';

        this.domNode.setAttribute('aria-valuenow', this.valueNow);
        this.domNode.setAttribute('aria-valuetext', this.valueText);

        if (this.valueDomNode) {
            this.valueDomNode.innerHTML = this.valueText;
        }

        this.toolbar.changeZoomRate(value);
    }

    handleKeyDown(event) {
        let flag = false;

        switch (event.keyCode) {
            case this.keyCode.DOWN:
                this.setValue(this.valueNow - this.INC_VAL);
                flag = true;
                break;
            case this.keyCode.UP:
                this.setValue(this.valueNow + this.INC_VAL);
                flag = true;
                break;
            case this.keyCode.PAGEDOWN:
                this.setValue(this.valueNow - this.BIG_INC);
                flag = true;
                break;
            case this.keyCode.PAGEUP:
                this.setValue(this.valueNow + this.BIG_INC);
                flag = true;
                break;

            case this.keyCode.HOME:
                this.setValue(this.valueMin);
                flag = true;
                break;

            case this.keyCode.END:
                this.setValue(this.valueMax);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleIncreaseClick(event) {
        this.setValue(this.valueNow + this.INC_VAL);
        event.preventDefault();
        event.stopPropagation();
    }

    handleDecreaseClick(event) {
        this.setValue(this.valueNow - this.INC_VAL);
        event.preventDefault();
        event.stopPropagation();
    }
}