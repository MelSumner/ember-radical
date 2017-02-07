import Component from 'ember-component';
import computed from 'ember-computed';
import hbs from 'htmlbars-inline-precompile';

/**
 * Core card.
 *
 * ```handlebars
 * {{#rad-card as |components|}}
 *   {{#components.title}}Card title{{/components.title}}
 *   {{#components.body}}Card body{{/components.body}}
 *   {{#components.footer}}Card footer{{/components.footer}}
 * {{/rad-card}}
 * ```
 *
 * {{#rad-card as |components|}}
 *   {{#components.title}}Party Time{{/components.title}}
 *   {{#components.body}}<img src="http://i.giphy.com/125RIkH7IluIpy.gif"/>{{/components.body}}
 * {{/rad-card}}
 *
 * @class Component.RadCard
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  /**
   * Pass a brand to use to style the component and it's child components.
   * @property brand
   * @type {string}
   * @default ''
   */
  brand: '',

  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Computed css class for the brand bound to the component.
   * @property brandClass
   * @type {String}
   */
  brandClass: computed(function() {
    return `card-${this.get('brand') ? this.get('brand') : 'default'}`
  }),
  /**
   * Bind standard core class: `card-footer`
   * @property classNames
   * @type {Array}
   */
  classNames: ['rad-card'],
  /**
   * Bind props to classes on the root component element.
   * @property classNameBindings
   * @type {Array}
   */
  classNameBindings: ['brandClass'],

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{yield (hash
      title=(component 'rad-card/title')
      body=(component 'rad-card/body')
      footer=(component 'rad-card/footer')
    )}}
  `
});