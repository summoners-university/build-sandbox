const Pages = {
  INDEX: '/',
  CHAMPIONS: '/champions',
  RUNES: '/runes',
  MASTERIES: '/masteries'
};

const EventCategories = {
  CHAMPION: 'champion',
  RUNE: 'rune',
  MASTERY: 'mastery',
};
const EventActions = {
  CLICK: 'click',
  SELECTED: 'selected',

};
const EventLabels = {
  ADDED: 'added',
  REMOVED: 'removed'
};

export { Pages, EventCategories, EventActions, EventLabels };
export default {

  /**
   * Tracks a page view.
   *
   * @param {string} path - The path of the current URL. Prefixed with '/'
   */
  trackPageView(path) {
    ga('send', {
      hitType: 'pageview',
      page: path
    });
  },

  /**
   * Tracks an event or interaction on the page.
   *
   * @param {string} category - The type of thing interacted with. (eg. Video)
   * @param {string} action - The type of interaction. (eg. play)
   * @param {string} label - Typically a subcategory.
   * @param {number} value - A useful and unique identification of the thing interacted with.
   */
  trackEvent({ category, action, label, value }) {
    ga('send', Object.assign({
      hitType: 'event'
    }, {
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    }));
  }
}