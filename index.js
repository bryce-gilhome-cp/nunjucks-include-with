'use strict';

const nunjucks = require('nunjucks');
const path = require('path');

/**
 * Include file with scoped data implementation for Nunjucks
 * @example
 * //Initialize IncludeWithNunjucksExtension
 * nunjucksEnv.addExtension('includeWith', new IncludeWithNunjucksExtension({
 *  nunjucksEnv
 * }));
 *
 * //Template
 * {% includeWith "objects/media/media_user_opinion_extended.tpl",
 *  { name: 'Test' },
 *  { useContext: true }
 * %}
 * @class
 */
class IncludeWithNunjucksExtension {
  constructor(args) {
    const tagName = args.hasOwnProperty('tagName') && args.tagName ? args.tagName : 'includeWith';
    this._nunjucksEnv = args.nunjucksEnv;
    this.tags = [tagName];
  }

  /**
   * @param {Object} parser
   * @param {Object} nodes
   * @return {Object}
   */
  parse(parser, nodes) {
    const tok = parser.nextToken();
    const args = parser.parseSignature(null, true);

    //// Resolve possible shortcut path.
    //const partialPath = args.children[0].value;
    //const template = this._nunjucksEnv.getTemplate(partialPath);
    //if (template) {
    //  args.children[0].value = template.path;
    //}

    parser.advanceAfterBlockEnd(tok.value);
    return new nodes.CallExtension(this, 'run', args, null);
  }

  /**
   * @param {Object} context
   * @param {string} partialPath
   * @param {Object} [data]
   * @param {Object} [options]
   * @return {string}
   */
  run(context, partialPath, data = {}, options = {}) {
    const useContext = options.hasOwnProperty('useContext') ? options.useContext : true;
    const composedData = useContext ? Object.assign({}, context.ctx, data) : data;
    const renderResult = this._nunjucksEnv.render(partialPath, composedData);
    return new nunjucks.runtime.SafeString(renderResult);
  }
}

module.exports = IncludeWithNunjucksExtension;