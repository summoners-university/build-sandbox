let clipboard = {};

export default {
    init(element) {
        clipboard = new ZeroClipboard(element);
    },
    setText(text) {
        clipboard.setText( text );
    },
    getElement() {
        return clipboard;
    }
};