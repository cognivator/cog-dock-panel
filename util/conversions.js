/** An array of RE patterns
 *  Intended to convert SASS source (SCSS format) to LESS
 *
 * @type {Object} rePattern
 * @property {String} rePattern.name Name of the conversion (may be used for reporting or reference during processing)
 * @property {String} rePattern.pattern RegEx to match
 * @property {String} rePattern.replace Replacement string, supports RE captures (i.e. $1, $2, etc.)
 *
 * @type {[rePattern]} replacementPatterns Order matters
 */
module.exports = {
  scss2less: [
    {
      name: 'Mixin declaration',
      pattern: /\@mixin\s+?(\w)/gmi,
      replace: "\.$1"
    },
    {
      name: 'Mixin inclusion',
      pattern: /\@include\s+?(\w)/gmi,
      replace: "\.$1"
    },
    {
      name: 'Variables',
      pattern: /\$\s*?(\w+?)/gmi,
      replace: "\@$1"
    },
    {
      name: '!default Variables',
      pattern: /\s+?\!default\;/gmi,
      replace: ";"
    },
    {
      name: 'Interpolation',
      pattern: /\#\{(\s*?[^\s]+?)/gmi,
      replace: "\@\{$1"
    },
    {
      name: 'Interpolation variable cleanup',
      pattern: /[\#\@]\{(.*?)[\$\@](\w+?)/gmi,
      replace: "\@\{$1$2"
    },
    {
      name: 'Import .scss extension',
      pattern: /(\@import.+\.)(?:scss|sass)(\s*?[\'"])/gmi,
      replace: '$1less$2'
    }//,
/*
    {
      // SPECIAL PROCESSING REQUIRED
      //  this rule must be iterated until no matches, and then followed by the @If cleanup
      type: 'iterated',
      name: '@If translation',
      pattern: /(\.|\@mixin\s*?)(\S+\s*?)\((([\$\@][^\s\:\,]+)(?:\:\s*?[^\s\,]+)?(\,?.*?))\)\s*?\{([\s\S]*?)(?:\@if\(0=0\)\{\}[\s\S]*?)*?\@(?:else\s*?)?if\s*?\(\s*?(?:\4.*?\=\s*?(\S+))\)\s*?\{([\s\S]*?)\}([\s\S]*?(?:\{(?:[\s\S]*?)\}(?:[\s\S]*?))*?)\}/gmi,
      replace: '$1$2($3) {$6@if(0=0){}\n$9}\n\n.$2($7$5) {$6\n$8\n}'
    },
    {
      name: '@If (0=0) cleanup',
      pattern: /(?:\.|\@mixin\s*?)\S+\s*?\(.*?\)\s*?\{(?:[\s\S]*?)\@if\(0=0\)(?:\{(?:[\s\S]*?)\}(?:[\s\S]*?))*?\}/gmi,
      replace: '\\\* Converted to guarded mixins\n$0\n\*\\'
    }
*/

    // see others from grunt-refactor as an example
  ]
};
