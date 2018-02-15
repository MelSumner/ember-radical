import Component from '@ember/component';
import { computed } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

// Utils
import { hiddenForArias } from '../../utils/arias';

/**
 *
 * Popover tooltips to Make UI Great Again.™
 *
 * Child component to wrap the popover content.
 *
 * @class Component.RadPopover.Content
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  //----------------------------------------------------------------------------

  /**
   * The position that the tooltip is created in relative to its anchor element.
   * Valid options are:
   * - `"top"`
   * - `"bottom"`
   * - `"left"`
   * - `"right"`
   * - `"bottom-left"`
   * - `"bottom-right"`
   *
   * Defaults to `"bottom"` if no value is supplied.
   *
   * @property position
   * @type {string}
   * @default ''
   */
  position: '',
  /**
   * The size of the tooltip itself. A list of preset sizes available are:
   * - `"small"`
   * - `"medium"`
   * - `"large"`
   * - `"x-large"`
   *
   * Defaults to `"medium"` if no value is supplied.
   *
   * @property size
   * @type {string}
   * @default ''
   */
  size: '',
  /**
   * Unique string generated by parent `rad-popover` Used for 508 attrs. Is
   * bound to id here and `aria-describedby` on the popover title.
   * @property aria-describedby
   * @type {string}
   */
  'aria-describedby': '',
  /**
   * Display status of the popover. Is bound to the properties `aria-hidden` for
   * better usability and to handle css of show/hide. Is also bound to html5
   * `hidden` attribute.
   * @property hidden
   * @type {Boolean}
   * @default true
   */
  hidden: true,

  // Properties
  //----------------------------------------------------------------------------

  /**
   * The `aria` role of this tooltip. Improves usability.
   * @property ariaRole
   * @type {string}
   */
  ariaRole: 'tooltip',
  /**
   * Handle binding `hidden` and `aria-hidden` for A++ usability :thumbsup:
   * @property attributeBindings
   * @type {Array}
   */
  attributeBindings: [
    'hiddenForArias:aria-hidden',
    'data-test'
  ],
  /**
   * Bind wrapping classname `popover-content`
   * @property classNames
   * @type {Array}
   */
  classNames: ['popover-content'],
  /**
   * Bind size and position props
   * @property classNameBindings
   * @type {Array}
   */
  classNameBindings: ['size', 'position'],
  /**
   * Computed prop returning **strings** for boolean of hidden. This is done so
   * that `aria-hidden` is always present on component and displays either "true"
   * or "false". (Binding boolean removes `aria-hidden` entirely when hidden is
   * true)
   * @property hiddenForArias
   * @type {string}
   * @param {string} hidden
   */
  hiddenForArias: computed('hidden', hiddenForArias),
  /**
   * Remove wrapping ember element for subcomponent, it's not needed.
   * @property tagName
   * @type {string}
   */
  tagName: 'div',

  // Hooks
  // ---------------------------------------------------------------------------

  /**
   * Handle binding passed `aria-describedby` as this component's `elementId` on
   * init.
   * @event init
   * @return {undefined}
   */
  init() {
    this._super(...arguments);

    // This should never happen so long as this component is called via the
    // "public" subcomponent reference but we will leave the check here just
    // to be safe
    if (!this.get('aria-describedby')) { return console.warn('Popover requires aria-describedby'); }
    // This id matches the `aria-describedby` of the tooltip title.
    this.set('elementId', this.get('aria-describedby'));

  },
  /**
   * Handle checking component width against window width on render. If overflowing
   * reset the width of the popover to prevent overflow. If the popover expands beneath the body,
   * we also set it to popover upwards instead.
   * @event didRender
   * @return {undefined}
   */
  didRender() {
    // if the popover will expands beyond the total height of the body, we set the position to top.
    const bodyHeight = $('body').height(),
          distanceTop = $(`#${this.get('elementId')}`).offset().top,
          thisHeight = $(`#${this.get('elementId')}`).outerHeight(true),
          currentPosition = this.get('position');
    if ( (distanceTop + thisHeight) > bodyHeight && currentPosition.includes('bottom')) {
      this.set('position', currentPosition.replace('bottom', 'top'));
    }

    const boundingRect = document.getElementById(this.get('elementId')).getBoundingClientRect();
    const bodyWidth = $('body').width();

    /*
     * If the box is centered, it will center itself back off of the page when we
     * subtract the necessary width from the component width. In these cases, we
     * will need to subtract twice the necessary width. The box is only ever centered
     * when position does not contain `-left`/`-right`.
     */
    const boxIsCentered = this.get('position') === 'top' || this.get('position') === 'bottom';

    // If the left offset of content is negative, then the content is to the left of the viewport.
    if (boundingRect.left < 0 ) {
      // determine length deduction based on centered.
      const widthDeduction = boxIsCentered ? boundingRect.left * 2 : boundingRect.left;

      // note `boundingRect.left` is negative so we add the deduction.
      const newWidth = boundingRect.width + widthDeduction;
      // Udpate component with new width, problem solved
      this.$().css({ width: newWidth });
    } // if the right right offset is greater than the body width, it is outside of our application.
    else if (boundingRect.right > bodyWidth ) {
      // determine length deduction based on centered.
      // The general deduction in this case would be the right offset of popover content minus the body width
      const widthDeduction = boxIsCentered ? (boundingRect.right - bodyWidth) * 2 : (boundingRect.right - bodyWidth);

      const newWidth = boundingRect.width - widthDeduction;
      // Udpate component with new width, problem solved
      this.$().css({ width: newWidth });
    }
  },

  // Events
  //----------------------------------------------------------------------------

  /**
   * Nasty touch eventses. Tricksy touch eventses. Any short touch event on this
   * content component will fire the focusOut and the mouseLeave on the
   * `rad-popover` element. Real abnoxious when you're trying to click something.
   * Fire the link or button manually. Through the wonderful power of JavaScript.
   *
   * @event touchEnd
   */
  touchEnd(evt){
    if(evt.target.tagName === 'A' || evt.target.tagName === 'BUTTON') {
      evt.target.click();
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <div class="tip"></div>
    {{yield}}
  `
});
