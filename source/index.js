let pages = {
    index: require('./pages/index'),
    planner: require('./pages/planner')
};

document.addEventListener('DOMContentLoaded', function () {
    let page = document.body.dataset['page'];
    pages[page].init();
});
