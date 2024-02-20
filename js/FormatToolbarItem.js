'use strict';

export default class FormatToolbarItem {

    constructor(domNode, toolbar, onChangedDrawMode = function (actionType, actionValue) {}) {

        this.domNode = domNode;
        this.onChangedDrawMode = onChangedDrawMode;
        this.toolbar = toolbar;
        this.buttonAction = '';
        this.value = '';
        this.popupLabelNode = null;
        this.hasHover = false;
        this.popupLabelDelay = 500;

        this.keyCode = Object.freeze({
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
        });
    }

    init() {
        this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.domNode.addEventListener('click', this.handleClick.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));
        this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
        this.domNode.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        document.body.addEventListener('keydown', this.handleHideAllPopupLabels.bind(this));

        this.buttonAction = this.domNode.getAttribute('action-type');
        this.value = this.domNode.getAttribute('action-value');

        if (this.buttonAction === 'draw-mode') {
            this.toolbar.drawItems.push(this);
        }

        // Initialize any popup label
        this.popupLabelNode = this.domNode.querySelector('.popup-label');
        if (this.popupLabelNode) {
            let width = 8 * this.popupLabelNode.textContent.length;
            this.popupLabelNode.style.width = width + 'px';
            this.popupLabelNode.style.left =
                -1 * ((width - this.domNode.offsetWidth) / 2) - 5 + 'px';
        }
    }

    setChecked() {
        this.domNode.setAttribute('aria-checked', 'true');
        this.domNode.checked = true;
    }

    resetChecked() {
        this.domNode.setAttribute('aria-checked', 'false');
        this.domNode.checked = false;
    }

    disable() {
        this.domNode.setAttribute('aria-disabled', 'true');
    }

    enable() {
        this.domNode.removeAttribute('aria-disabled');
    }

    showPopupLabel() {
        if (this.popupLabelNode) {
            this.toolbar.hidePopupLabels();
            this.popupLabelNode.classList.add('show');
        }
    }

    hidePopupLabel() {
        if (this.popupLabelNode && !this.hasHover) {
            this.popupLabelNode.classList.remove('show');
        }
    }

    handleHideAllPopupLabels(event) {
        switch (event.keyCode) {
            case this.keyCode.ESC:
                this.toolbar.hidePopupLabels();
                break;
            default:
                break;
        }
    }

    handleBlur() {
        this.toolbar.domNode.classList.remove('focus');

        if (this.domNode.classList.contains('clearMode')) {
            this.domNode.parentNode.classList.remove('focus');
        }
        this.hidePopupLabel();
    }

    handleFocus() {
        this.toolbar.domNode.classList.add('focus');

        if (this.domNode.classList.contains('clearMode')) {
            this.domNode.parentNode.classList.add('focus');
        }
        this.showPopupLabel();
    }

    handleMouseLeave() {
        this.hasHover = false;
        setTimeout(this.hidePopupLabel.bind(this), this.popupLabelDelay);
    }

    handleMouseOver () {
        this.showPopupLabel();
        this.hasHover = true;
    }

    handleKeyDown(event) {
        let flag = false;
        switch (event.keyCode) {
            case this.keyCode.ENTER:
            case this.keyCode.SPACE:
                if (
                    this.buttonAction !== ''
                ) {
                    this.toolbar.activateItem(this);
                    if (this.buttonAction !== 'clearMode') {
                        flag = true;
                    }
                }
                break;

            case this.keyCode.RIGHT:
                this.toolbar.setFocusToNext(this);
                flag = true;
                break;

            case this.keyCode.LEFT:
                this.toolbar.setFocusToPrevious(this);
                flag = true;
                break;

            case this.keyCode.HOME:
                this.toolbar.setFocusToFirst(this);
                flag = true;
                break;

            case this.keyCode.END:
                this.toolbar.setFocusToLast(this);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    handleClick() {
        if (this.buttonAction === 'link') {
            return;
        }
        this.onChangedDrawMode(this.buttonAction, this.value);
        this.toolbar.setFocusItem(this);
        this.toolbar.activateItem(this);
    }

}