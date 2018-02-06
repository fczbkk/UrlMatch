window.addEventListener('load', function () {
  var patterns_field = document.getElementById('patterns');
  var urls_field = document.getElementById('urls');
  var results_field = document.getElementById('results')

  patterns_field.addEventListener('change', displayResults);
  patterns_field.addEventListener('keyup', displayResults);
  urls_field.addEventListener('change', displayResults);
  urls_field.addEventListener('keyup', displayResults);

  function getInput (field) {
    return splitMultiline(field.value);
  }

  function splitMultiline (input) {
    return input.split('\n');
  }

  function getWrappedDetail (data) {
    console.log('data', data);
    var class_name = (data.result) ? 'result-ok' : 'result-fail';
    return (
      '<span class="' + class_name + '" title="' + data.pattern + '">'
      + (data.value === '' ? ' ' : data.value)
      + '</span>'
    );
  }

  function getResultDetail (data) {
    var parts = [];

    parts.push(getWrappedDetail(data.scheme));
    parts.push('://');
    parts.push(getWrappedDetail(data.host));
    parts.push('/');
    parts.push(getWrappedDetail(data.path));

    if (data.params.value !== null) {
      parts.push('?');
      parts.push(getWrappedDetail(data.params));
    }

    if (data.fragment.value !== null) {
      parts.push('#');
      parts.push(getWrappedDetail(data.fragment));
    }

    return parts.join('');
  }

  function getPatternHeader (pattern) {
    return '<th>' + pattern + '</th>';
  }

  function getNonEmpty (input) {
    return input !== '';
  }

  function displayResults () {
    var patterns = getInput(patterns_field).filter(getNonEmpty);
    var urls = getInput(urls_field).filter(getNonEmpty);
    var url_match = new UrlMatch.default(patterns);

    var table_head = patterns.map(getPatternHeader).join('');

    var table_body = urls.map(
      function (url) {
        var data = url_match.debug(url);
        return '<tr>' + patterns.map(
          function (pattern) {
            return '<td>' + getResultDetail(data[pattern]) + '</td>';
          }
        ).join('') + '</tr>';
      }
    ).join('');

    var table = '<table>' +
      '<thead>' + table_head + '</thead>' +
      '<tbody>' + table_body + '</tbody>' +
    '</table>';

    results_field.innerHTML = table;
  }

  displayResults();
});




